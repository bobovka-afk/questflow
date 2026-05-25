import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import {
  CharacterAvatarPreset,
  GenderCharacter,
  XpEventType,
} from '../generated/prisma/enums';
import { CharacterService } from './character.service';
import { PrismaService } from '../prisma/prisma.service';
import { createPrismaMock } from '../testing/prisma-mock';

describe('CharacterService', () => {
  let service: CharacterService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(() => {
    prisma = createPrismaMock();
    service = new CharacterService(prisma as unknown as PrismaService);
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
      xpEvent: { create: jest.fn() },
    };

    beforeEach(() => {
      prisma.$transaction!.mockImplementation(async (fn) =>
        fn(tx as never),
      );
    });

    it('throws when character missing in transaction', async () => {
      tx.character.findUnique.mockResolvedValue(null);
      await expect(
        service.addExperience(1, 50, XpEventType.TASK_COMPLETED),
      ).rejects.toThrow(NotFoundException);
    });

    it('enforces daily task XP limit', async () => {
      tx.character.findUnique.mockResolvedValue({
        currentXp: 0,
        level: 1,
        dailyTaskXpCount: 5,
      });
      await expect(
        service.addExperience(1, 100, XpEventType.TASK_COMPLETED),
      ).rejects.toThrow(ConflictException);
    });

    it('maps duplicate xp event to conflict', async () => {
      tx.character.findUnique.mockResolvedValue({
        currentXp: 0,
        level: 1,
        dailyTaskXpCount: 0,
      });
      const err = new Prisma.PrismaClientKnownRequestError('dup', {
        code: 'P2002',
        clientVersion: 'test',
      });
      tx.xpEvent.create.mockRejectedValue(err);
      await expect(
        service.addExperience(1, 100, XpEventType.TASK_COMPLETED, 9),
      ).rejects.toThrow(ConflictException);
    });

    it('levels up when XP threshold reached', async () => {
      tx.character.findUnique.mockResolvedValue({
        currentXp: 950,
        level: 1,
        dailyTaskXpCount: 0,
      });
      tx.xpEvent.create.mockResolvedValue({});
      const updated = { level: 2, currentXp: 50 };
      tx.character.update.mockResolvedValue(updated);

      await expect(
        service.addExperience(1, 100, XpEventType.TASK_COMPLETED),
      ).resolves.toEqual(updated);

      expect(tx.character.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            level: 2,
            dailyTaskXpCount: { increment: 1 },
          }),
        }),
      );
    });

    it('adds XP without level up', async () => {
      tx.character.findUnique.mockResolvedValue({
        currentXp: 10,
        level: 1,
        dailyTaskXpCount: 0,
      });
      tx.xpEvent.create.mockResolvedValue({});
      tx.character.update.mockResolvedValue({ level: 1, currentXp: 60 });

      await service.addExperience(1, 50, XpEventType.DAILY_CHECKIN);

      expect(tx.character.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { currentXp: 60, level: 1 },
        }),
      );
    });
  });
});
