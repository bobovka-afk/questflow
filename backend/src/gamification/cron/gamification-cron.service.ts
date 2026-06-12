import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Prisma } from '../../generated/prisma/client';
import { HealthEventReason } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { DEFAULT_GAME_DAY_TZ } from '../constants';
import { resolveGameDayTimeZone } from '../lib/resolve-game-day-timezone';
import {
  CHARACTER_GRACE_PERIOD_MS,
  HP_INACTIVITY_PENALTY,
  HP_MISSED_DAILIES_DAILY_CAP,
  HP_MISSED_DAILY_PENALTY,
} from '../config/rewards';
import { getYesterdayGameDayKey } from '../core/game-day';
import { wasUserActiveOnGameDay } from '../core/inactivity';

export { DEFAULT_GAME_DAY_TZ } from '../constants';
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
    const timeZone = this.getGameDayTimeZone();
    const job = new CronJob(
      RESET_DAILY_TASK_XP_CRON_EXPRESSION,
      () => {
        void this.runMidnightGamificationJobs();
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

  getGameDayTimeZone(): string {
    return resolveGameDayTimeZone(
      this.configService.get<string>('GAME_DAY_TZ'),
      this.logger,
    );
  }

  async runMidnightGamificationJobs(): Promise<void> {
    await this.resetDailyTaskXpCounts();
    await this.applyInactivityHpPenalty();
    await this.processMissedPersonalDailies();
  }

  async resetDailyTaskXpCounts(): Promise<{ count: number }> {
    const result = await this.prisma.character.updateMany({
      where: { dailyActivityXpEarned: { gt: 0 } },
      data: { dailyActivityXpEarned: 0 },
    });
    this.logger.log(
      `Reset dailyActivityXpEarned for ${result.count} character(s)`,
    );
    return { count: result.count };
  }

  async applyInactivityHpPenalty(): Promise<{
    penalized: number;
    skippedActive: number;
    skippedGrace: number;
  }> {
    const timeZone = this.getGameDayTimeZone();
    const yesterdayKey = getYesterdayGameDayKey(timeZone);
    const graceCutoff = new Date(Date.now() - CHARACTER_GRACE_PERIOD_MS);

    const characters = await this.prisma.character.findMany({
      where: { health: { gt: 0 } },
      select: {
        id: true,
        userId: true,
        health: true,
        createdAt: true,
      },
    });

    let penalized = 0;
    let skippedActive = 0;
    let skippedGrace = 0;

    for (const character of characters) {
      if (character.createdAt >= graceCutoff) {
        skippedGrace++;
        continue;
      }

      const active = await wasUserActiveOnGameDay(
        this.prisma,
        character.userId,
        yesterdayKey,
        timeZone,
      );
      if (active) {
        skippedActive++;
        continue;
      }

      const applied = await this.applyPenaltyForCharacter(
        character.id,
        character.userId,
        character.health,
        yesterdayKey,
      );
      if (applied) {
        penalized++;
      }
    }

    this.logger.log(
      `Inactivity HP penalty for ${yesterdayKey.toISOString().slice(0, 10)}: ` +
        `${penalized} penalized, ${skippedActive} active, ${skippedGrace} in grace`,
    );

    return { penalized, skippedActive, skippedGrace };
  }

  private async applyPenaltyForCharacter(
    characterId: number,
    userId: number,
    currentHealth: number,
    inactiveDayKey: Date,
  ): Promise<boolean> {
    const newHealth = Math.max(0, currentHealth - HP_INACTIVITY_PENALTY);

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.healthEvent.create({
          data: {
            userId,
            dayKey: inactiveDayKey,
            delta: -HP_INACTIVITY_PENALTY,
            reason: HealthEventReason.INACTIVITY_PENALTY,
          },
        });
        await tx.character.update({
          where: { id: characterId },
          data: { health: newHealth },
        });
      });
      return true;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return false;
      }
      throw error;
    }
  }

  async processMissedPersonalDailies(): Promise<{ penalized: number }> {
    const timeZone = this.getGameDayTimeZone();
    const yesterdayKey = getYesterdayGameDayKey(timeZone);
    const yesterdayStr = yesterdayKey.toISOString().slice(0, 10);

    const dailies = await this.prisma.personalDaily.findMany({
      where: { archivedAt: null },
      select: {
        id: true,
        userId: true,
        lastCompletedDayKey: true,
        user: { select: { character: { select: { id: true, health: true } } } },
      },
    });

    let penalized = 0;
    const hpByUser = new Map<number, number>();
    const healthByUser = new Map<number, number>();

    for (const daily of dailies) {
      const completed =
        daily.lastCompletedDayKey?.toISOString().slice(0, 10) === yesterdayStr;
      if (completed) {
        continue;
      }
      const character = daily.user.character;
      if (!character || character.health <= 0) {
        continue;
      }
      if (!healthByUser.has(daily.userId)) {
        healthByUser.set(daily.userId, character.health);
      }

      const currentPenalty = hpByUser.get(daily.userId) ?? 0;
      if (currentPenalty >= HP_MISSED_DAILIES_DAILY_CAP) {
        continue;
      }

      try {
        const currentHealth = healthByUser.get(daily.userId)!;
        const nextHealth = Math.max(0, currentHealth - HP_MISSED_DAILY_PENALTY);
        await this.prisma.$transaction(async (tx) => {
          await tx.personalDailyMissLog.create({
            data: {
              userId: daily.userId,
              personalDailyId: daily.id,
              dayKey: yesterdayKey,
              hpDelta: -HP_MISSED_DAILY_PENALTY,
            },
          });
          await tx.character.update({
            where: { id: character.id },
            data: { health: nextHealth },
          });
        });
        healthByUser.set(daily.userId, nextHealth);
        hpByUser.set(daily.userId, currentPenalty + HP_MISSED_DAILY_PENALTY);
        penalized++;
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          continue;
        }
        throw error;
      }
    }

    this.logger.log(`Missed personal dailies penalty: ${penalized} daily(ies)`);
    return { penalized };
  }
}
