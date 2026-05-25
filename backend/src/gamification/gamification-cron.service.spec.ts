import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import {
  DEFAULT_GAME_DAY_TZ,
  GamificationCronService,
  RESET_DAILY_TASK_XP_CRON_EXPRESSION,
  RESET_DAILY_TASK_XP_CRON_NAME,
} from './gamification-cron.service';
import { PrismaService } from '../prisma/prisma.service';
import { createPrismaMock } from '../testing/prisma-mock';

jest.mock('cron', () => ({
  CronJob: jest.fn().mockImplementation(() => ({
    start: jest.fn(),
  })),
}));

describe('GamificationCronService', () => {
  let service: GamificationCronService;
  let prisma: ReturnType<typeof createPrismaMock>;
  let configService: { get: jest.Mock };
  let schedulerRegistry: { addCronJob: jest.Mock };

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

    it('cron callback invokes resetDailyTaskXpCounts', async () => {
      configService.get.mockReturnValue('UTC');
      prisma.character!.updateMany!.mockResolvedValue({ count: 0 });
      const resetSpy = jest.spyOn(service, 'resetDailyTaskXpCounts');

      service.onModuleInit();

      const cronCallback = (
        CronJob as unknown as jest.Mock
      ).mock.calls[0][1] as () => void;
      await cronCallback();

      expect(resetSpy).toHaveBeenCalled();
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
});
