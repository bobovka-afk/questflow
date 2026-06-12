export type ChestTier = 'COMMON' | 'RARE' | 'EPIC';

export type CosmeticType =
  | 'AVATAR_PRESET'
  | 'PORTRAIT_FRAME'
  | 'PROFILE_BACKGROUND'
  | 'TITLE_BADGE';

export const CHEST_TIER_LABEL_RU: Record<ChestTier, string> = {
  COMMON: 'Обычный',
  RARE: 'Редкий',
  EPIC: 'Эпический',
};

export const COSMETIC_TYPE_LABEL_RU: Record<CosmeticType, string> = {
  AVATAR_PRESET: 'Образ персонажа',
  PORTRAIT_FRAME: 'Рамка портрета',
  PROFILE_BACKGROUND: 'Фон профиля',
  TITLE_BADGE: 'Значок титула',
};

export function cosmeticTypeCanEquip(type: CosmeticType): boolean {
  return type === 'PORTRAIT_FRAME' || type === 'PROFILE_BACKGROUND';
}

export function isTitleBadgeCosmetic(type: CosmeticType): boolean {
  return type === 'TITLE_BADGE';
}

export type QuestChestSnippet = {
  id: number;
  tier: ChestTier;
  openedAt: string | null;
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
  completedAt: string | null;
  rewardChestTier: ChestTier;
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

export type UserChestDto = {
  id: number;
  tier: ChestTier;
  source: string;
  openedAt: string | null;
  createdAt: string;
};

export type InventoryItemDto = {
  id: number;
  equipped: boolean;
  obtainedAt: string;
  cosmeticItem: {
    id: number;
    key: string;
    type: CosmeticType;
    tier: ChestTier;
    nameRu: string;
  };
};

export type OpenChestResult = {
  chestId: number;
  cosmeticKey: string;
  cosmeticNameRu: string;
  cosmeticType: CosmeticType;
  cosmeticTier: ChestTier;
  alreadyOwned: boolean;
  inventoryItemId: number | null;
  dustGranted: number;
  dustBalance: number;
};

export const DUST_FOR_DUPLICATE_BY_TIER: Record<ChestTier, number> = {
  COMMON: 15,
  RARE: 40,
  EPIC: 100,
};

export type DustShopOptionView = {
  tier: ChestTier;
  cost: number;
  titleRu: string;
  descriptionRu: string;
  canAfford: boolean;
};

export type DustShopView = {
  balance: number;
  options: DustShopOptionView[];
};

export type PurchaseDustChestResult = {
  chestId: number;
  tier: ChestTier;
  dustSpent: number;
  dustBalance: number;
};

export type AchievementProgressItem = {
  key: string;
  titleRu: string;
  descriptionRu: string | null;
  metric: string;
  target: number;
  current: number;
  rewardDust: number;
  unlocked: boolean;
  unlockedAt: string | null;
};

export type CharacterAchievementsView = {
  achievements: AchievementProgressItem[];
};
