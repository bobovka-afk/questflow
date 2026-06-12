import { DAILY_ACTIVITY_XP_MAX } from '../config/rewards';
import { GamificationCronService } from '../cron/gamification-cron.service';
import { createPrismaMock } from '../../testing/prisma-mock';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';

describe('Gamification regression (Phase 4)', () => {
  it('documents daily XP cap constant', () => {
    expect(DAILY_ACTIVITY_XP_MAX).toBe(500);
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
        where: { dailyActivityXpEarned: { gt: 0 } },
        data: { dailyActivityXpEarned: 0 },
      });
    });
  });
});
