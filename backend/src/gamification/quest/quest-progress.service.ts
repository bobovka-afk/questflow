import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '../../generated/prisma/client';
import {
  AchievementMetric,
  QuestMetric,
  QuestPeriod,
  UserNotificationType,
} from '../../generated/prisma/enums';
import { NotificationService } from '../../notification/notification.service';
import { AchievementService } from '../achievement/achievement.service';
import { PrismaService } from '../../prisma/prisma.service';
import { resolveGameDayTimeZone } from '../lib/resolve-game-day-timezone';
import { ChestService } from '../chest/chest.service';
import { getGameDayKey, getTodayGameDayKey } from '../core/game-day';
import type { ChestTier } from '../../generated/prisma/enums';
import type {
  CharacterQuestsView,
  QuestCompletionResult,
} from './interface/quest.interface';
import {
  getDailyPeriodKey,
  getMonthlyPeriodKey,
  getWeeklyPeriodKey,
  getWeekDayKeyRange,
} from './quest-period';

type QuestTx = Prisma.TransactionClient;

@Injectable()
export class QuestProgressService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly chestService: ChestService,
    private readonly achievementService: AchievementService,
    private readonly notificationService: NotificationService,
  ) {}

  private getTimeZone(): string {
    return resolveGameDayTimeZone(
      this.configService.get<string>('GAME_DAY_TZ'),
    );
  }

  async getQuestsForUser(userId: number): Promise<CharacterQuestsView> {
    const tz = this.getTimeZone();
    const dailyKey = getDailyPeriodKey(new Date(), tz);
    const weeklyKey = getWeeklyPeriodKey(new Date(), tz);
    const monthlyKey = getMonthlyPeriodKey(new Date(), tz);

    const templates = await this.prisma.questTemplate.findMany({
      where: { active: true },
      orderBy: [{ period: 'asc' }, { sortOrder: 'asc' }],
    });

    const progressRows = await this.prisma.userQuestProgress.findMany({
      where: {
        userId,
        periodKey: { in: [dailyKey, weeklyKey, monthlyKey] },
      },
      include: {
        chest: true,
      },
    });

    const progressByKey = new Map(
      progressRows.map((p) => [`${p.templateId}:${p.periodKey}`, p]),
    );

    const buildGroup = (period: QuestPeriod, periodKey: string) => ({
      periodKey,
      quests: templates
        .filter((t) => t.period === period)
        .map((t) => {
          const row = progressByKey.get(`${t.id}:${periodKey}`);
          return {
            templateId: t.id,
            key: t.key,
            titleRu: t.titleRu,
            descriptionRu: t.descriptionRu,
            metric: t.metric,
            target: t.target,
            current: row?.current ?? 0,
            completed: Boolean(row?.completedAt),
            completedAt: row?.completedAt ?? null,
            chest: row?.chest
              ? {
                  id: row.chest.id,
                  tier: row.chest.tier,
                  openedAt: row.chest.openedAt,
                }
              : null,
          };
        }),
    });

    return {
      daily: buildGroup(QuestPeriod.DAILY, dailyKey),
      weekly: buildGroup(QuestPeriod.WEEKLY, weeklyKey),
      monthly: buildGroup(QuestPeriod.MONTHLY, monthlyKey),
    };
  }

  async recordCardCompleted(
    userId: number,
    input: {
      cardId: number;
      workspaceId: number;
      dueDate: Date | null;
    },
  ): Promise<QuestCompletionResult[]> {
    const hasCharacter = await this.prisma.character.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!hasCharacter) {
      return [];
    }

    const tz = this.getTimeZone();
    const now = new Date();
    const dayKey = getTodayGameDayKey(tz);
    const dailyKey = getDailyPeriodKey(now, tz);
    const weeklyKey = getWeeklyPeriodKey(now, tz);
    const monthlyKey = getMonthlyPeriodKey(now, tz);

    const results = await this.prisma.$transaction(async (tx) => {
      await tx.userWorkspaceQuestDay.upsert({
        where: {
          userId_workspaceId_dayKey: {
            userId,
            workspaceId: input.workspaceId,
            dayKey,
          },
        },
        create: {
          userId,
          workspaceId: input.workspaceId,
          dayKey,
        },
        update: {},
      });

      const batch: QuestCompletionResult[] = [];

      batch.push(
        ...(await this.incrementMetric(
          tx,
          userId,
          QuestMetric.CARDS_COMPLETED,
          dailyKey,
          weeklyKey,
          monthlyKey,
        )),
      );

      if (input.dueDate && this.isDueToday(input.dueDate, tz)) {
        batch.push(
          ...(await this.incrementMetric(
            tx,
            userId,
            QuestMetric.CARDS_COMPLETED_WITH_DUE_TODAY,
            dailyKey,
            weeklyKey,
            monthlyKey,
          )),
        );
      }

      batch.push(
        ...(await this.syncDistinctWorkspacesProgress(
          tx,
          userId,
          weeklyKey,
          tz,
        )),
      );

      return batch;
    });
    await this.notifyQuestCompletions(userId, results);
    return results;
  }

  async recordCommentCreated(userId: number): Promise<QuestCompletionResult[]> {
    if (!(await this.hasCharacter(userId))) {
      return [];
    }
    const tz = this.getTimeZone();
    const now = new Date();
    const dailyKey = getDailyPeriodKey(now, tz);
    const weeklyKey = getWeeklyPeriodKey(now, tz);
    const monthlyKey = getMonthlyPeriodKey(now, tz);

    const results = await this.prisma.$transaction((tx) =>
      this.incrementMetric(
        tx,
        userId,
        QuestMetric.COMMENTS_CREATED,
        dailyKey,
        weeklyKey,
        monthlyKey,
      ),
    );
    await this.notifyQuestCompletions(userId, results);
    return results;
  }

  async recordDailyCheckin(userId: number): Promise<QuestCompletionResult[]> {
    if (!(await this.hasCharacter(userId))) {
      return [];
    }
    const tz = this.getTimeZone();
    const now = new Date();
    const dailyKey = getDailyPeriodKey(now, tz);
    const weeklyKey = getWeeklyPeriodKey(now, tz);
    const monthlyKey = getMonthlyPeriodKey(now, tz);

    const results = await this.prisma.$transaction((tx) =>
      this.incrementMetric(
        tx,
        userId,
        QuestMetric.DAILY_CHECKIN_DONE,
        dailyKey,
        weeklyKey,
        monthlyKey,
      ),
    );
    await this.notifyQuestCompletions(userId, results);
    return results;
  }

  async recordXpDay(userId: number, dayKey: Date): Promise<QuestCompletionResult[]> {
    if (!(await this.hasCharacter(userId))) {
      return [];
    }
    const tz = this.getTimeZone();
    const weeklyKey = getWeeklyPeriodKey(dayKey, tz);

    const results = await this.prisma.$transaction(async (tx) => {
      await tx.userQuestXpDay.upsert({
        where: {
          userId_dayKey: { userId, dayKey },
        },
        create: { userId, dayKey },
        update: {},
      });

      return this.syncActiveXpDaysProgress(tx, userId, weeklyKey, tz);
    });
    await this.notifyQuestCompletions(userId, results);
    return results;
  }

  private async notifyQuestCompletions(
    userId: number,
    results: QuestCompletionResult[],
  ): Promise<void> {
    const newly = results.filter((r) => r.newlyCompleted);
    if (newly.length === 0) {
      return;
    }
    await this.achievementService.recordIncrement(
      userId,
      AchievementMetric.QUESTS_COMPLETED_TOTAL,
      newly.length,
    );
    for (const q of newly) {
      await this.notificationService.create(
        userId,
        UserNotificationType.QUEST_COMPLETED,
        {
          questKey: q.key,
          questTitle: q.titleRu,
          chestId: q.chestId,
        },
      );
      if (q.chestId) {
        await this.notificationService.create(
          userId,
          UserNotificationType.CHEST_READY,
          {
            chestId: q.chestId,
            questTitle: q.titleRu,
          },
        );
      }
    }
  }

  private async hasCharacter(userId: number): Promise<boolean> {
    const row = await this.prisma.character.findUnique({
      where: { userId },
      select: { id: true },
    });
    return Boolean(row);
  }

  private isDueToday(dueDate: Date, timeZone: string): boolean {
    const today = getTodayGameDayKey(timeZone);
    const dueDay = getGameDayKey(dueDate, timeZone);
    return dueDay.getTime() === today.getTime();
  }

  private resolvePeriodKey(
    period: QuestPeriod,
    dailyKey: string,
    weeklyKey: string,
    monthlyKey: string,
  ): string {
    if (period === QuestPeriod.DAILY) return dailyKey;
    if (period === QuestPeriod.WEEKLY) return weeklyKey;
    return monthlyKey;
  }

  private async incrementMetric(
    tx: QuestTx,
    userId: number,
    metric: QuestMetric,
    dailyKey: string,
    weeklyKey: string,
    monthlyKey: string,
  ): Promise<QuestCompletionResult[]> {
    const templates = await tx.questTemplate.findMany({
      where: { active: true, metric },
    });
    const results: QuestCompletionResult[] = [];

    for (const template of templates) {
      const periodKey = this.resolvePeriodKey(
        template.period,
        dailyKey,
        weeklyKey,
        monthlyKey,
      );
      const completed = await this.incrementTemplateProgress(
        tx,
        userId,
        template.id,
        periodKey,
        template.target,
        template.rewardChestTier,
        template.key,
        template.titleRu,
      );
      if (completed) {
        results.push(completed);
      }
    }

    return results;
  }

  private async incrementTemplateProgress(
    tx: QuestTx,
    userId: number,
    templateId: number,
    periodKey: string,
    target: number,
    tier: ChestTier,
    key: string,
    titleRu: string,
  ): Promise<QuestCompletionResult | null> {
    const existing = await tx.userQuestProgress.findUnique({
      where: {
        userId_templateId_periodKey: {
          userId,
          templateId,
          periodKey,
        },
      },
    });

    if (existing?.completedAt) {
      return null;
    }

    const current = Math.min(target, (existing?.current ?? 0) + 1);
    const justCompleted = current >= target;
    const completedAt = justCompleted ? new Date() : null;

    let chestId = existing?.chestId ?? null;
    if (justCompleted && !chestId) {
      const source = this.chestService.buildQuestChestSource(
        templateId,
        periodKey,
      );
      const grant = await this.chestService.grantChest(tx, userId, tier, source);
      chestId = grant.chestId;
    }

    await tx.userQuestProgress.upsert({
      where: {
        userId_templateId_periodKey: {
          userId,
          templateId,
          periodKey,
        },
      },
      create: {
        userId,
        templateId,
        periodKey,
        current,
        completedAt,
        chestId,
      },
      update: {
        current,
        completedAt: completedAt ?? undefined,
        chestId: chestId ?? undefined,
      },
    });

    if (!justCompleted) {
      return null;
    }

    return {
      templateId,
      key,
      titleRu,
      newlyCompleted: true,
      chestId,
    };
  }

  private async syncActiveXpDaysProgress(
    tx: QuestTx,
    userId: number,
    weeklyKey: string,
    timeZone: string,
  ): Promise<QuestCompletionResult[]> {
    const template = await tx.questTemplate.findFirst({
      where: {
        active: true,
        metric: QuestMetric.ACTIVE_DAYS_WITH_XP,
        period: QuestPeriod.WEEKLY,
      },
    });
    if (!template) {
      return [];
    }

    const { start, end } = getWeekDayKeyRange(weeklyKey, timeZone);
    const count = await tx.userQuestXpDay.count({
      where: {
        userId,
        dayKey: { gte: start, lte: end },
      },
    });

    return this.setTemplateProgressTo(
      tx,
      userId,
      template,
      weeklyKey,
      count,
    );
  }

  private async syncDistinctWorkspacesProgress(
    tx: QuestTx,
    userId: number,
    weeklyKey: string,
    timeZone: string,
  ): Promise<QuestCompletionResult[]> {
    const template = await tx.questTemplate.findFirst({
      where: {
        active: true,
        metric: QuestMetric.DISTINCT_WORKSPACES_ACTIVE,
        period: QuestPeriod.WEEKLY,
      },
    });
    if (!template) {
      return [];
    }

    const { start, end } = getWeekDayKeyRange(weeklyKey, timeZone);
    const rows = await tx.userWorkspaceQuestDay.findMany({
      where: {
        userId,
        dayKey: { gte: start, lte: end },
      },
      select: { workspaceId: true },
      distinct: ['workspaceId'],
    });

    return this.setTemplateProgressTo(
      tx,
      userId,
      template,
      weeklyKey,
      rows.length,
    );
  }

  private async setTemplateProgressTo(
    tx: QuestTx,
    userId: number,
    template: {
      id: number;
      key: string;
      titleRu: string;
      target: number;
      rewardChestTier: ChestTier;
    },
    periodKey: string,
    value: number,
  ): Promise<QuestCompletionResult[]> {
    const existing = await tx.userQuestProgress.findUnique({
      where: {
        userId_templateId_periodKey: {
          userId,
          templateId: template.id,
          periodKey,
        },
      },
    });

    if (existing?.completedAt) {
      return [];
    }

    const current = Math.min(template.target, value);
    const justCompleted = current >= template.target;
    if (!justCompleted && existing?.current === current) {
      return [];
    }

    let chestId = existing?.chestId ?? null;
    if (justCompleted && !chestId) {
      const source = this.chestService.buildQuestChestSource(
        template.id,
        periodKey,
      );
      const grant = await this.chestService.grantChest(
        tx,
        userId,
        template.rewardChestTier,
        source,
      );
      chestId = grant.chestId;
    }

    await tx.userQuestProgress.upsert({
      where: {
        userId_templateId_periodKey: {
          userId,
          templateId: template.id,
          periodKey,
        },
      },
      create: {
        userId,
        templateId: template.id,
        periodKey,
        current,
        completedAt: justCompleted ? new Date() : null,
        chestId,
      },
      update: {
        current,
        completedAt: justCompleted ? new Date() : null,
        chestId: chestId ?? undefined,
      },
    });

    if (!justCompleted) {
      return [];
    }

    return [
      {
        templateId: template.id,
        key: template.key,
        titleRu: template.titleRu,
        newlyCompleted: true,
        chestId,
      },
    ];
  }
}
