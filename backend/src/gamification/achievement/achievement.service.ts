import { Injectable } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { AchievementMetric } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  AchievementProgressItem,
  AchievementUnlockResult,
  CharacterAchievementsView,
} from './interface/achievement.interface';

type AchievementTx = Prisma.TransactionClient;

@Injectable()
export class AchievementService {
  constructor(private readonly prisma: PrismaService) {}

  async getAchievementsForUser(userId: number): Promise<CharacterAchievementsView> {
    const [templates, unlocked, progressRows] = await Promise.all([
      this.prisma.achievementTemplate.findMany({
        where: { active: true },
        orderBy: { sortOrder: 'asc' },
      }),
      this.prisma.userAchievement.findMany({
        where: { userId },
        include: { template: { select: { key: true } } },
      }),
      this.prisma.userAchievementProgress.findMany({ where: { userId } }),
    ]);

    const unlockedByTemplateId = new Map(
      unlocked.map((u) => [u.templateId, u.unlockedAt]),
    );
    const progressByMetric = new Map(
      progressRows.map((p) => [p.metric, p.current]),
    );

    const achievements: AchievementProgressItem[] = templates.map((t) => {
      const unlockedAt = unlockedByTemplateId.get(t.id) ?? null;
      return {
        key: t.key,
        titleRu: t.titleRu,
        descriptionRu: t.descriptionRu,
        metric: t.metric,
        target: t.target,
        current: progressByMetric.get(t.metric) ?? 0,
        rewardDust: t.rewardDust,
        unlocked: unlockedAt != null,
        unlockedAt,
      };
    });

    return { achievements };
  }

  async recordIncrement(
    userId: number,
    metric: AchievementMetric,
    delta = 1,
  ): Promise<AchievementUnlockResult[]> {
    if (!(await this.hasCharacter(userId))) {
      return [];
    }
    return this.prisma.$transaction((tx) =>
      this.applyProgress(tx, userId, metric, { increment: delta }),
    );
  }

  async recordMax(
    userId: number,
    metric: AchievementMetric,
    value: number,
  ): Promise<AchievementUnlockResult[]> {
    if (!(await this.hasCharacter(userId))) {
      return [];
    }
    return this.prisma.$transaction((tx) =>
      this.applyProgress(tx, userId, metric, { setMax: value }),
    );
  }

  async recordCosmeticsOwnedCount(
    userId: number,
    tx?: AchievementTx,
  ): Promise<AchievementUnlockResult[]> {
    if (!(await this.hasCharacter(userId))) {
      return [];
    }
    const count = await (tx ?? this.prisma).inventoryItem.count({
      where: { userId },
    });
    if (tx) {
      return this.applyProgress(tx, userId, AchievementMetric.COSMETICS_OWNED_COUNT, {
        setExact: count,
      });
    }
    return this.prisma.$transaction((inner) =>
      this.applyProgress(inner, userId, AchievementMetric.COSMETICS_OWNED_COUNT, {
        setExact: count,
      }),
    );
  }

  private async applyProgress(
    tx: AchievementTx,
    userId: number,
    metric: AchievementMetric,
    update: { increment?: number; setMax?: number; setExact?: number },
  ): Promise<AchievementUnlockResult[]> {
    const existing = await tx.userAchievementProgress.findUnique({
      where: { userId_metric: { userId, metric } },
    });

    let next = existing?.current ?? 0;
    if (update.setExact != null) {
      next = update.setExact;
    } else if (update.setMax != null) {
      next = Math.max(next, update.setMax);
    } else {
      next += update.increment ?? 1;
    }

    await tx.userAchievementProgress.upsert({
      where: { userId_metric: { userId, metric } },
      create: { userId, metric, current: next },
      update: { current: next },
    });

    return this.unlockEligible(tx, userId, metric, next);
  }

  private async unlockEligible(
    tx: AchievementTx,
    userId: number,
    metric: AchievementMetric,
    current: number,
  ): Promise<AchievementUnlockResult[]> {
    const templates = await tx.achievementTemplate.findMany({
      where: { active: true, metric },
    });
    if (templates.length === 0) {
      return [];
    }

    const already = await tx.userAchievement.findMany({
      where: {
        userId,
        templateId: { in: templates.map((t) => t.id) },
      },
      select: { templateId: true },
    });
    const unlockedIds = new Set(already.map((a) => a.templateId));
    const results: AchievementUnlockResult[] = [];

    for (const template of templates) {
      if (unlockedIds.has(template.id) || current < template.target) {
        continue;
      }

      await tx.userAchievement.create({
        data: { userId, templateId: template.id },
      });

      if (template.rewardDust > 0) {
        await tx.character.update({
          where: { userId },
          data: { dust: { increment: template.rewardDust } },
        });
        await this.applyProgress(tx, userId, AchievementMetric.DUST_EARNED_TOTAL, {
          increment: template.rewardDust,
        });
      }

      results.push({
        key: template.key,
        titleRu: template.titleRu,
        rewardDust: template.rewardDust,
      });
    }

    return results;
  }

  private async hasCharacter(userId: number): Promise<boolean> {
    const row = await this.prisma.character.findUnique({
      where: { userId },
      select: { id: true },
    });
    return Boolean(row);
  }
}
