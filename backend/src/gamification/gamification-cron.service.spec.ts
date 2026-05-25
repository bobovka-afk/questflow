import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Prisma } from '../generated/prisma/client';
import { HealthEventReason } from '../generated/prisma/enums';
import {
  DEFAULT_GAME_DAY_TZ,
  GamificationCronService,
  RESET_DAILY_TASK_XP_CRON_EXPRESSION,
  RESET_DAILY_TASK_XP_CRON_NAME,
} from './gamification-cron.service';
import { PrismaService } from '../prisma/prisma.service';
import { createPrismaMock } from '../testing/prisma-mock';
import { HP_INACTIVITY_PENALTY } from './config/rewards';

jest.mock('cron', () => ({
  CronJob: jest.fn().mockImplementation(() => ({
    start: jest.fn(),
  })),
}));

jest.mock('./inactivity', () => ({
  wasUserActiveOnGameDay: jest.fn(),
}));

import { wasUserActiveOnGameDay } from './inactivity';

describe('GamificationCronService', () => {
  let service: GamificationCronService;
  let prisma: ReturnType<typeof createPrismaMock>;
  let configService: { get: jest.Mock };
  let schedulerRegistry: { addCronJob: jest.Mock };
  const wasUserActiveOnGameDayMock = wasUserActiveOnGameDay as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    prisma = createPrismaMock();
    configService = { get: jest.fn() };
    schedulerRegistry = { addCronJob: jest.fn() };
    service = new GamificationCronService(
      prisma as unknown as PrismaService,
      configService as unknown as ConfigService,
      schedulerRegistry as unknown as SchedulerRegistry,
    );
  });

  describe('onModuleInit', () => {
    it('registers midnight cron with GAME_DAY_TZ from config', () => {
      configService.get.mockReturnValue('Europe/Moscow');

      service.onModuleInit();

      expect(configService.get).toHaveBeenCalledWith('GAME_DAY_TZ');
      expect(CronJob).toHaveBeenCalledWith(
        RESET_DAILY_TASK_XP_CRON_EXPRESSION,
        expect.any(Function),
        null,
        true,
        'Europe/Moscow',
      );
      expect(schedulerRegistry.addCronJob).toHaveBeenCalledWith(
        RESET_DAILY_TASK_XP_CRON_NAME,
        expect.objectContaining({ start: expect.any(Function) }),
      );
    });

    it('defaults timezone to UTC when GAME_DAY_TZ is unset', () => {
      configService.get.mockReturnValue(undefined);

      service.onModuleInit();

      expect(CronJob).toHaveBeenCalledWith(
        RESET_DAILY_TASK_XP_CRON_EXPRESSION,
        expect.any(Function),
        null,
        true,
        DEFAULT_GAME_DAY_TZ,
      );
    });

    it('cron callback invokes midnight gamification jobs', async () => {
      configService.get.mockReturnValue('UTC');
      prisma.character!.updateMany!.mockResolvedValue({ count: 0 });
      prisma.character!.findMany!.mockResolvedValue([]);
      const midnightSpy = jest.spyOn(service, 'runMidnightGamificationJobs');

      service.onModuleInit();

      const cronCallback = (
        CronJob as unknown as jest.Mock
      ).mock.calls[0][1] as () => void;
      await cronCallback();

      expect(midnightSpy).toHaveBeenCalled();
    });
  });

  describe('resetDailyTaskXpCounts', () => {
    it('zeroes dailyTaskXpCount only for characters above zero', async () => {
      prisma.character!.updateMany!.mockResolvedValue({ count: 3 });

      await expect(service.resetDailyTaskXpCounts()).resolves.toEqual({
        count: 3,
      });

      expect(prisma.character!.updateMany).toHaveBeenCalledWith({
        where: { dailyTaskXpCount: { gt: 0 } },
        data: { dailyTaskXpCount: 0 },
      });
    });

    it('returns zero when no characters need reset', async () => {
      prisma.character!.updateMany!.mockResolvedValue({ count: 0 });

      await expect(service.resetDailyTaskXpCounts()).resolves.toEqual({
        count: 0,
      });
    });
  });

  describe('applyInactivityHpPenalty', () => {
    const graceOld = new Date('2020-01-01T00:00:00.000Z');

    beforeEach(() => {
      configService.get.mockReturnValue('UTC');
    });

    it('skips characters in grace period', async () => {
      prisma.character!.findMany!.mockResolvedValue([
        {
          id: 1,
          userId: 10,
          health: 50,
          createdAt: new Date(),
        },
      ]);

      await expect(service.applyInactivityHpPenalty()).resolves.toEqual({
        penalized: 0,
        skippedActive: 0,
        skippedGrace: 1,
      });

      expect(wasUserActiveOnGameDayMock).not.toHaveBeenCalled();
    });

    it('skips active users without penalty', async () => {
      prisma.character!.findMany!.mockResolvedValue([
        { id: 1, userId: 10, health: 50, createdAt: graceOld },
      ]);
      wasUserActiveOnGameDayMock.mockResolvedValue(true);

      await expect(service.applyInactivityHpPenalty()).resolves.toEqual({
        penalized: 0,
        skippedActive: 1,
        skippedGrace: 0,
      });

      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('applies penalty for inactive user', async () => {
      prisma.character!.findMany!.mockResolvedValue([
        { id: 1, userId: 10, health: 50, createdAt: graceOld },
      ]);
      wasUserActiveOnGameDayMock.mockResolvedValue(false);
      prisma.$transaction!.mockImplementation(async (fn) => fn(prisma));

      await expect(service.applyInactivityHpPenalty()).resolves.toEqual({
        penalized: 1,
        skippedActive: 0,
        skippedGrace: 0,
      });

      expect(prisma.healthEvent!.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 10,
          delta: -HP_INACTIVITY_PENALTY,
          reason: HealthEventReason.INACTIVITY_PENALTY,
        }),
      });
      expect(prisma.character!.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { health: 45 },
      });
    });

    it('does not double-penalize when HealthEvent already exists', async () => {
      prisma.character!.findMany!.mockResolvedValue([
        { id: 1, userId: 10, health: 50, createdAt: graceOld },
      ]);
      wasUserActiveOnGameDayMock.mockResolvedValue(false);
      const dup = new Prisma.PrismaClientKnownRequestError('dup', {
        code: 'P2002',
        clientVersion: 'test',
      });
      prisma.$transaction!.mockRejectedValue(dup);

      await expect(service.applyInactivityHpPenalty()).resolves.toEqual({
        penalized: 0,
        skippedActive: 0,
        skippedGrace: 0,
      });
    });
  });
});
