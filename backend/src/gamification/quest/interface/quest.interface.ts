import type { ChestTier, QuestPeriod } from '../../../generated/prisma/enums';

export type QuestChestSnippet = {
  id: number;
  tier: ChestTier;
  openedAt: Date | null;
};

export type QuestProgressItem = {
  templateId: number;
  key: string;
  titleRu: string;
  descriptionRu: string | null;
  metric: string;
  target: number;
  current: number;
  completed: boolean;
  completedAt: Date | null;
  chest: QuestChestSnippet | null;
};

export type QuestPeriodGroup = {
  periodKey: string;
  quests: QuestProgressItem[];
};

export type CharacterQuestsView = {
  daily: QuestPeriodGroup;
  weekly: QuestPeriodGroup;
  monthly: QuestPeriodGroup;
};

export type QuestCompletionResult = {
  templateId: number;
  key: string;
  titleRu: string;
  newlyCompleted: boolean;
  chestId: number | null;
};
