import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '../generated/prisma/client';
import {
  CharacterAvatarPreset,
  GenderCharacter,
  XpEventType,
} from '../generated/prisma/enums';
import { CharacterService } from './character.service';
import { PrismaService } from '../prisma/prisma.service';
import { createPrismaMock } from '../testing/prisma-mock';
import { QuestProgressService } from '../gamification/quest/quest-progress.service';
import {
  CHARACTER_HEALTH_MAX,
  DAILY_TASK_XP_COMPLETIONS_MAX,
  HP_GAIN_PER_XP_EVENT,
  XP_DAILY_CHECKIN,
  XP_PER_TASK_COMPLETED,
} from '../gamification/config/rewards';
import { getTodayGameDayKey, getYesterdayGameDayKey } from '../gamification/core/game-day';

const baseXpStats = {
  currentXp: 0,
  level: 1,
  dailyTaskXpCount: 0,
  health: 100,
  checkinStreak: 0,
  lastCheckinDayKey: null as Date | null,
};

describe('CharacterService', () => {
  let service: CharacterService;
  let prisma: ReturnType<typeof createPrismaMock>;
  let configService: { get: jest.Mock };

  beforeEach(() => {
    prisma = createPrismaMock();
    configService = { get: jest.fn().mockReturnValue('UTC') };
    const questProgressService = {
      recordXpDay: jest.fn().mockResolvedValue([]),
      recordDailyCheckin: jest.fn().mockResolvedValue([]),
    } as unknown as QuestProgressService;
    const achievementService = {
      recordMax: jest.fn().mockResolvedValue([]),
      recordIncrement: jest.fn().mockResolvedValue([]),
    };
    service = new CharacterService(
      prisma as unknown as PrismaService,
      configService as unknown as ConfigService,
      questProgressService,
      achievementService as never,
    );
  });

  describe('getCharacter', () => {
    it('throws when character missing', async () => {
      prisma.character!.findUnique!.mockResolvedValue(null);
      await expect(service.getCharacter(1)).rejects.toThrow(NotFoundException);
    });

    it('returns character', async () => {
      const character = { id: 1, userId: 1, level: 1 };
      prisma.character!.findUnique!.mockResolvedValue(character);
      await expect(service.getCharacter(1)).resolves.toEqual(character);
    });
  });

  describe('createCharacter', () => {
    it('rejects duplicate', async () => {
      prisma.character!.findUnique!.mockResolvedValue({ id: 1 });
      await expect(
        service.createCharacter(1, {
          name: 'Hero',
          gender: GenderCharacter.MALE,
          avatarPreset: CharacterAvatarPreset.DRUID_MAN,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('creates character', async () => {
      prisma.character!.findUnique!.mockResolvedValue(null);
      const created = { id: 2, userId: 1, name: 'Hero' };
      prisma.character!.create!.mockResolvedValue(created);
      await expect(
        service.createCharacter(1, {
          name: 'Hero',
          gender: GenderCharacter.MALE,
          avatarPreset: CharacterAvatarPreset.DRUID_MAN,
        }),
      ).resolves.toEqual(created);
    });
  });

  describe('updateCharacter', () => {
    it('requires at least one field', async () => {
      await expect(service.updateCharacter(1, {})).rejects.toThrow(
        BadRequestException,
      );
    });

    it('updates existing character', async () => {
      prisma.character!.findUnique!.mockResolvedValue({ id: 1, userId: 1 });
      prisma.character!.update!.mockResolvedValue({ id: 1, name: 'New' });
      await service.updateCharacter(1, { name: 'New' });
      expect(prisma.character!.update).toHaveBeenCalled();
    });
  });

  describe('getCharacterForViewer', () => {
    it('returns public character', async () => {
      const character = { id: 3, userId: 2 };
      prisma.character!.findUnique!.mockResolvedValue(character);
      await expect(service.getCharacterForViewer(3)).resolves.toEqual(character);
    });
  });

  describe('addExperience', () => {
    const tx = {
      character: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      xpEvent: { create: jest.fn(), findFirst: jest.fn() },
    };

    beforeEach(() => {
      jest.clearAllMocks();
      prisma.$transaction!.mockImplementation(async (fn) =>
        fn(tx as never),
      );
      tx.xpEvent.findFirst.mockResolvedValue(null);
      configService.get.mockReturnValue('UTC');
    });

    it('throws when character missing in transaction', async () => {
      tx.character.findUnique.mockResolvedValue(null);
      await expect(
        service.addExperience(1, 50, XpEventType.TASK_COMPLETED),
      ).rejects.toThrow(NotFoundException);
    });

    it('enforces daily task XP limit', async () => {
      tx.character.findUnique.mockResolvedValue({
        ...baseXpStats,
        dailyTaskXpCount: DAILY_TASK_XP_COMPLETIONS_MAX,
      });
      await expect(
        service.addExperience(1, XP_PER_TASK_COMPLETED, XpEventType.TASK_COMPLETED),
      ).rejects.toThrow(ConflictException);
    });

    it('maps duplicate xp event to conflict', async () => {
      tx.character.findUnique.mockResolvedValue({ ...baseXpStats });
      const err = new Prisma.PrismaClientKnownRequestError('dup', {
        code: 'P2002',
        clientVersion: 'test',
      });
      tx.xpEvent.create.mockRejectedValue(err);
      await expect(
        service.addExperience(1, XP_PER_TASK_COMPLETED, XpEventType.TASK_COMPLETED, 9),
      ).rejects.toThrow(ConflictException);
    });

    it('levels up when XP threshold reached', async () => {
      tx.character.findUnique.mockResolvedValue({
        ...baseXpStats,
        currentXp: 950,
        health: 80,
      });
      tx.xpEvent.create.mockResolvedValue({});
      const updated = { level: 2, currentXp: 150, checkinStreak: 1 };
      tx.character.update.mockResolvedValue(updated);

      const result = await service.addExperience(
        1,
        XP_PER_TASK_COMPLETED,
        XpEventType.TASK_COMPLETED,
      );

      expect(result.character).toEqual(updated);
      expect(result.rewards).toMatchObject({
        taskXp: XP_PER_TASK_COMPLETED,
        checkinXp: XP_DAILY_CHECKIN,
        hpGained: HP_GAIN_PER_XP_EVENT,
        streakIncreased: true,
      });
      expect(tx.xpEvent.create).toHaveBeenCalledTimes(2);
      expect(tx.character.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            level: 2,
            currentXp: 150,
            health: 85,
            checkinStreak: 1,
            dailyTaskXpCount: { increment: 1 },
          }),
        }),
      );
    });

    it('adds XP without level up', async () => {
      tx.character.findUnique.mockResolvedValue({
        ...baseXpStats,
        currentXp: 10,
        health: 90,
      });
      tx.xpEvent.create.mockResolvedValue({});
      tx.character.update.mockResolvedValue({
        level: 1,
        currentXp: 10 + XP_DAILY_CHECKIN,
        checkinStreak: 1,
      });

      const dayKey = new Date('2026-05-25T00:00:00.000Z');
      const result = await service.addExperience(
        1,
        XP_DAILY_CHECKIN,
        XpEventType.DAILY_CHECKIN,
        null,
        dayKey,
      );

      expect(result.rewards.checkinXp).toBe(XP_DAILY_CHECKIN);
      expect(result.rewards.streakIncreased).toBe(true);
      expect(tx.xpEvent.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          type: XpEventType.DAILY_CHECKIN,
          dayKey,
          cardId: null,
          xpAmount: XP_DAILY_CHECKIN,
        }),
      });
      expect(tx.character.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            currentXp: 10 + XP_DAILY_CHECKIN,
            level: 1,
            health: 90,
            checkinStreak: 1,
            lastCheckinDayKey: dayKey,
          }),
        }),
      );
      expect(tx.xpEvent.create).toHaveBeenCalledTimes(1);
    });

    it('grants CHECKIN_STREAK milestone XP when series reaches 7', async () => {
      const tz = 'UTC';
      const yesterdayKey = getYesterdayGameDayKey(tz);
      tx.character.findUnique.mockResolvedValue({
        ...baseXpStats,
        currentXp: 0,
        health: 90,
        checkinStreak: 6,
        lastCheckinDayKey: yesterdayKey,
      });
      tx.xpEvent.create.mockResolvedValue({});
      tx.xpEvent.findFirst.mockResolvedValue(null);
      tx.character.update.mockResolvedValue({
        level: 1,
        checkinStreak: 7,
      });

      configService.get.mockReturnValue(tz);
      const result = await service.addExperience(
        1,
        XP_PER_TASK_COMPLETED,
        XpEventType.TASK_COMPLETED,
        55,
      );

      expect(result.rewards.streakMilestonesReached).toEqual([7]);
      expect(result.rewards.streakMilestoneXp).toBe(200);
      const streakCreates = tx.xpEvent.create.mock.calls.filter(
        (call) => call[0].data.type === XpEventType.CHECKIN_STREAK,
      );
      expect(streakCreates).toHaveLength(1);
      expect(streakCreates[0][0].data).toMatchObject({
        xpAmount: 200,
        dayKey: expect.any(Date),
      });
      expect(getTodayGameDayKey(tz)).toBeDefined();
    });

    it('auto daily check-in on first task XP without extra HP', async () => {
      tx.character.findUnique.mockResolvedValue({
        ...baseXpStats,
        health: 90,
      });
      tx.xpEvent.create.mockResolvedValue({});
      tx.character.update.mockResolvedValue({
        level: 1,
        currentXp: XP_PER_TASK_COMPLETED + XP_DAILY_CHECKIN,
        health: 95,
        checkinStreak: 1,
      });

      const result = await service.addExperience(
        1,
        XP_PER_TASK_COMPLETED,
        XpEventType.TASK_COMPLETED,
        42,
      );

      expect(result.rewards).toMatchObject({
        taskXp: XP_PER_TASK_COMPLETED,
        checkinXp: XP_DAILY_CHECKIN,
        hpGained: HP_GAIN_PER_XP_EVENT,
        checkinStreak: 1,
        streakIncreased: true,
      });

      expect(tx.xpEvent.create).toHaveBeenCalledTimes(2);
      expect(tx.xpEvent.create).toHaveBeenNthCalledWith(1, {
        data: expect.objectContaining({
          type: XpEventType.TASK_COMPLETED,
          cardId: 42,
          xpAmount: XP_PER_TASK_COMPLETED,
        }),
      });
      expect(tx.xpEvent.create).toHaveBeenNthCalledWith(2, {
        data: expect.objectContaining({
          type: XpEventType.DAILY_CHECKIN,
          cardId: null,
          xpAmount: XP_DAILY_CHECKIN,
          dayKey: expect.any(Date),
        }),
      });
      expect(tx.character.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            currentXp: XP_PER_TASK_COMPLETED + XP_DAILY_CHECKIN,
            health: 95,
          }),
        }),
      );
    });

    it('does not auto check-in when already done today', async () => {
      tx.character.findUnique.mockResolvedValue({
        ...baseXpStats,
        dailyTaskXpCount: 1,
        health: 95,
        checkinStreak: 1,
      });
      tx.xpEvent.findFirst.mockResolvedValue({ id: 99 });
      tx.xpEvent.create.mockResolvedValue({});
      tx.character.update.mockResolvedValue({});

      await service.addExperience(
        1,
        XP_PER_TASK_COMPLETED,
        XpEventType.TASK_COMPLETED,
        43,
      );

      expect(tx.xpEvent.create).toHaveBeenCalledTimes(1);
    });

    it('requires dayKey for daily check-in', async () => {
      await expect(
        service.addExperience(1, XP_DAILY_CHECKIN, XpEventType.DAILY_CHECKIN),
      ).rejects.toThrow(BadRequestException);
    });

    it('maps duplicate daily check-in to CHECKIN_ALREADY_DONE', async () => {
      tx.character.findUnique.mockResolvedValue({ ...baseXpStats });
      const err = new Prisma.PrismaClientKnownRequestError('dup', {
        code: 'P2002',
        clientVersion: 'test',
      });
      tx.xpEvent.create.mockRejectedValue(err);
      try {
        await service.addExperience(
          1,
          XP_DAILY_CHECKIN,
          XpEventType.DAILY_CHECKIN,
          null,
          new Date('2026-05-25T00:00:00.000Z'),
        );
        fail('expected ConflictException');
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect((error as ConflictException).getResponse()).toMatchObject({
          code: 'CHECKIN_ALREADY_DONE',
        });
      }
    });
  });

  describe('dailyCheckin', () => {
    const tx = {
      character: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      xpEvent: { create: jest.fn(), findFirst: jest.fn() },
    };

    beforeEach(() => {
      jest.clearAllMocks();
      prisma.$transaction!.mockImplementation(async (fn) =>
        fn(tx as never),
      );
      configService.get.mockReturnValue('Europe/Moscow');
    });

    it('grants daily check-in XP with today dayKey in configured TZ', async () => {
      tx.character.findUnique.mockResolvedValue({ ...baseXpStats });
      tx.xpEvent.create.mockResolvedValue({});
      tx.character.update.mockResolvedValue({
        level: 1,
        currentXp: XP_DAILY_CHECKIN,
        checkinStreak: 1,
      });

      const result = await service.dailyCheckin(1);
      expect(result.rewards.checkinXp).toBe(XP_DAILY_CHECKIN);

      expect(configService.get).toHaveBeenCalledWith('GAME_DAY_TZ');
      expect(tx.xpEvent.findFirst).not.toHaveBeenCalled();
      expect(tx.xpEvent.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 1,
          type: XpEventType.DAILY_CHECKIN,
          xpAmount: XP_DAILY_CHECKIN,
          cardId: null,
          dayKey: expect.any(Date),
        }),
      });
    });
  });
});
