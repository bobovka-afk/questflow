import { DAILY_TASK_XP_COMPLETIONS_MAX } from '../config/rewards';
import { GamificationCronService } from '../cron/gamification-cron.service';
import { createPrismaMock } from '../../testing/prisma-mock';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';

describe('Gamification regression (Phase 4)', () => {
  it('documents daily XP cap constant', () => {
    expect(DAILY_TASK_XP_COMPLETIONS_MAX).toBe(5);
  });

  describe('cron reset', () => {
    it('resetDailyTaskXpCounts zeroes counter for characters with usage', async () => {
      const prisma = createPrismaMock();
      prisma.character!.updateMany!.mockResolvedValue({ count: 3 });
      const service = new GamificationCronService(
        prisma as unknown as PrismaService,
        { get: jest.fn() } as unknown as ConfigService,
        { addCronJob: jest.fn() } as unknown as SchedulerRegistry,
      );
      await service.resetDailyTaskXpCounts();
      expect(prisma.character!.updateMany).toHaveBeenCalledWith({
        where: { dailyTaskXpCount: { gt: 0 } },
        data: { dailyTaskXpCount: 0 },
      });
    });
  });
});
