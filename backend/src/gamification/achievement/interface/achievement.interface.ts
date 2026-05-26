import type { AchievementMetric } from '../../../generated/prisma/enums';

export type AchievementProgressItem = {
  key: string;
  titleRu: string;
  descriptionRu: string | null;
  metric: AchievementMetric;
  target: number;
  current: number;
  rewardDust: number;
  unlocked: boolean;
  unlockedAt: Date | null;
};

export type CharacterAchievementsView = {
  achievements: AchievementProgressItem[];
};

export type AchievementUnlockResult = {
  key: string;
  titleRu: string;
  rewardDust: number;
};
