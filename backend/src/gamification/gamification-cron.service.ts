import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { PrismaService } from '../prisma/prisma.service';

export const DEFAULT_GAME_DAY_TZ = 'UTC';
export const RESET_DAILY_TASK_XP_CRON_NAME = 'resetDailyTaskXpCounts';
export const RESET_DAILY_TASK_XP_CRON_EXPRESSION = '0 0 * * *';

@Injectable()
export class GamificationCronService implements OnModuleInit {
  private readonly logger = new Logger(GamificationCronService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  onModuleInit(): void {
    const timeZone =
      this.configService.get<string>('GAME_DAY_TZ') ?? DEFAULT_GAME_DAY_TZ;
    const job = new CronJob(
      RESET_DAILY_TASK_XP_CRON_EXPRESSION,
      () => {
        void this.resetDailyTaskXpCounts();
      },
      null,
      true,
      timeZone,
    );
    this.schedulerRegistry.addCronJob(RESET_DAILY_TASK_XP_CRON_NAME, job);
    this.logger.log(
      `Scheduled ${RESET_DAILY_TASK_XP_CRON_NAME} at 00:00 (${timeZone})`,
    );
  }

  async resetDailyTaskXpCounts(): Promise<{ count: number }> {
    const result = await this.prisma.character.updateMany({
      where: { dailyTaskXpCount: { gt: 0 } },
      data: { dailyTaskXpCount: 0 },
    });
    this.logger.log(
      `Reset dailyTaskXpCount for ${result.count} character(s)`,
    );
    return { count: result.count };
  }
}
