import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '../generated/prisma/client';
import {
  AchievementMetric,
  HabitPolarity,
  XpEventType,
} from '../generated/prisma/enums';
import { CharacterService } from '../character/character.service';
import {
  HP_HABIT_NEGATIVE_PENALTY,
  XP_PER_HABIT_POSITIVE,
  XP_PER_PERSONAL_DAILY,
  XP_PER_PERSONAL_TODO,
} from '../gamification/config/rewards';
import { getTodayGameDayKey, getYesterdayGameDayKey } from '../gamification/core/game-day';
import { resolveGameDayTimeZone } from '../gamification/lib/resolve-game-day-timezone';
import { AchievementService } from '../gamification/achievement/achievement.service';
import { QuestProgressService } from '../gamification/quest/quest-progress.service';
import { PrismaService } from '../prisma/prisma.service';
import type { XpGrantRewards } from '../gamification/xp/interface';

export type PersonalActionResult = {
  ok: true;
  rewards?: XpGrantRewards;
  xpGranted?: boolean;
};

@Injectable()
export class PersonalRewardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly characterService: CharacterService,
    private readonly questProgressService: QuestProgressService,
    private readonly achievementService: AchievementService,
  ) {}

  private getTimeZone(): string {
    return resolveGameDayTimeZone(this.configService.get<string>('GAME_DAY_TZ'));
  }

  async completeTodo(userId: number, todoId: number): Promise<PersonalActionResult> {
    const todo = await this.prisma.personalTodo.findFirst({
      where: { id: todoId, userId, archivedAt: null },
    });
    if (!todo) {
      throw new NotFoundException({ code: 'PERSONAL_TODO_NOT_FOUND', message: 'Todo not found' });
    }
    if (todo.isCompleted) {
      return { ok: true, xpGranted: false };
    }

    await this.prisma.personalTodo.update({
      where: { id: todoId },
      data: { isCompleted: true, completedAt: new Date() },
    });

    let rewards: XpGrantRewards | undefined;
    let xpGranted = false;
    try {
      const outcome = await this.characterService.addExperience(
        userId,
        XP_PER_PERSONAL_TODO,
        XpEventType.PERSONAL_TODO_COMPLETED,
        null,
        null,
        { personalTodoId: todoId },
      );
      rewards = outcome.rewards;
      xpGranted = true;
      await this.questProgressService.recordPersonalTodoCompleted(userId);
      await this.achievementService.recordIncrement(
        userId,
        AchievementMetric.PERSONAL_TODOS_COMPLETED_TOTAL,
        1,
      );
    } catch (error) {
      if (!this.isBenignXpError(error)) {
        throw error;
      }
    }

    return { ok: true, rewards, xpGranted };
  }

  async uncompleteTodo(userId: number, todoId: number): Promise<{ ok: true }> {
    const todo = await this.prisma.personalTodo.findFirst({
      where: { id: todoId, userId, archivedAt: null },
    });
    if (!todo) {
      throw new NotFoundException({ code: 'PERSONAL_TODO_NOT_FOUND', message: 'Todo not found' });
    }
    await this.prisma.personalTodo.update({
      where: { id: todoId },
      data: { isCompleted: false, completedAt: null },
    });
    return { ok: true };
  }

  async completeDaily(userId: number, dailyId: number): Promise<PersonalActionResult> {
    const tz = this.getTimeZone();
    const todayKey = getTodayGameDayKey(tz);
    const daily = await this.prisma.personalDaily.findFirst({
      where: { id: dailyId, userId, archivedAt: null },
    });
    if (!daily) {
      throw new NotFoundException({ code: 'PERSONAL_DAILY_NOT_FOUND', message: 'Daily not found' });
    }
    if (
      daily.lastCompletedDayKey &&
      daily.lastCompletedDayKey.toISOString().slice(0, 10) === todayKey.toISOString().slice(0, 10)
    ) {
      throw new ConflictException({
        code: 'PERSONAL_DAILY_ALREADY_DONE',
        message: 'Daily already completed for today',
      });
    }

    const yesterdayKey = getYesterdayGameDayKey(tz);
    const yesterdayStr = yesterdayKey.toISOString().slice(0, 10);
    const lastStr = daily.lastCompletedDayKey?.toISOString().slice(0, 10);
    const streakCurrent = lastStr === yesterdayStr ? daily.streakCurrent + 1 : 1;
    const streakBest = Math.max(daily.streakBest, streakCurrent);

    await this.prisma.personalDaily.update({
      where: { id: dailyId },
      data: {
        lastCompletedDayKey: todayKey,
        streakCurrent,
        streakBest,
      },
    });

    let rewards: XpGrantRewards | undefined;
    let xpGranted = false;
    try {
      const outcome = await this.characterService.addExperience(
        userId,
        XP_PER_PERSONAL_DAILY,
        XpEventType.PERSONAL_DAILY_COMPLETED,
        null,
        todayKey,
        { personalDailyId: dailyId },
      );
      rewards = outcome.rewards;
      xpGranted = true;
      await this.questProgressService.recordPersonalDailyCompleted(userId);
    } catch (error) {
      if (!this.isBenignXpError(error)) {
        throw error;
      }
    }

    return { ok: true, rewards, xpGranted };
  }

  async logHabit(
    userId: number,
    habitId: number,
    direction: 'positive' | 'negative',
  ): Promise<PersonalActionResult> {
    const tz = this.getTimeZone();
    const todayKey = getTodayGameDayKey(tz);
    const habit = await this.prisma.personalHabit.findFirst({
      where: { id: habitId, userId, archivedAt: null },
    });
    if (!habit) {
      throw new NotFoundException({ code: 'PERSONAL_HABIT_NOT_FOUND', message: 'Habit not found' });
    }

    if (direction === 'negative') {
      if (habit.polarity === HabitPolarity.POSITIVE) {
        throw new BadRequestException({
          code: 'HABIT_LOG_NOT_ALLOWED',
          message: 'Negative log not allowed for this habit',
        });
      }

      await this.prisma.personalHabit.update({
        where: { id: habitId },
        data: {
          negativeCount: { increment: 1 },
          streakCurrent: 0,
        },
      });

      const character = await this.prisma.character.findUnique({
        where: { userId },
        select: { id: true, health: true },
      });
      if (character && character.health > 0) {
        try {
          await this.prisma.$transaction(async (tx) => {
            await tx.personalHabitNegativeLog.create({
              data: {
                userId,
                personalHabitId: habitId,
                dayKey: todayKey,
                hpDelta: -HP_HABIT_NEGATIVE_PENALTY,
              },
            });
            const nextHealth = Math.max(
              0,
              character.health - HP_HABIT_NEGATIVE_PENALTY,
            );
            await tx.character.update({
              where: { id: character.id },
              data: { health: nextHealth },
            });
          });
        } catch (error) {
          if (
            !(
              error instanceof Prisma.PrismaClientKnownRequestError &&
              error.code === 'P2002'
            )
          ) {
            throw error;
          }
        }
      }

      return { ok: true, xpGranted: false };
    }

    if (habit.polarity === HabitPolarity.NEGATIVE) {
      throw new BadRequestException({
        code: 'HABIT_LOG_NOT_ALLOWED',
        message: 'Positive log not allowed for this habit',
      });
    }

    const updated = await this.prisma.personalHabit.update({
      where: { id: habitId },
      data: {
        positiveCount: { increment: 1 },
        streakCurrent: { increment: 1 },
      },
    });
    const streakBest = Math.max(updated.streakBest, updated.streakCurrent);
    if (streakBest > updated.streakBest) {
      await this.prisma.personalHabit.update({
        where: { id: habitId },
        data: { streakBest },
      });
    }

    let rewards: XpGrantRewards | undefined;
    let xpGranted = false;
    try {
      const outcome = await this.characterService.addExperience(
        userId,
        XP_PER_HABIT_POSITIVE,
        XpEventType.HABIT_POSITIVE,
        null,
        todayKey,
        { personalHabitId: habitId },
      );
      rewards = outcome.rewards;
      xpGranted = true;
      await this.questProgressService.recordHabitPositiveLogged(userId);
      await this.achievementService.recordIncrement(
        userId,
        AchievementMetric.HABIT_POSITIVE_LOGGED_TOTAL,
        1,
      );
      await this.achievementService.recordMax(
        userId,
        AchievementMetric.HABIT_STREAK_BEST_MAX,
        streakBest,
      );
    } catch (error) {
      if (!this.isBenignXpError(error)) {
        throw error;
      }
    }

    return { ok: true, rewards, xpGranted };
  }

  private isBenignXpError(error: unknown): boolean {
    if (!(error instanceof ConflictException)) {
      return false;
    }
    const response = error.getResponse();
    if (typeof response !== 'object' || response === null) {
      return false;
    }
    const code = (response as { code?: string }).code;
    return (
      code === 'XP_EVENT_ALREADY_RECORDED' ||
      code === 'DAILY_ACTIVITY_XP_LIMIT' ||
      code === 'DAILY_TASK_XP_LIMIT' ||
      code === 'DAILY_HABIT_XP_LIMIT'
    );
  }
}
