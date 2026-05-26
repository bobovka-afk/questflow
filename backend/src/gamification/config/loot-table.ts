import { ChestTier, CosmeticType } from '../../generated/prisma/enums';

export type LootEntry = {
  cosmeticKey: string;
  weight: number;
};

export const LOOT_TABLE_BY_TIER: Record<ChestTier, LootEntry[]> = {
  [ChestTier.COMMON]: [
    { cosmeticKey: 'frame_bronze', weight: 30 },
    { cosmeticKey: 'frame_silver', weight: 25 },
    { cosmeticKey: 'badge_starter', weight: 25 },
    { cosmeticKey: 'bg_meadow', weight: 20 },
  ],
  [ChestTier.RARE]: [
    { cosmeticKey: 'frame_gold', weight: 30 },
    { cosmeticKey: 'bg_night', weight: 25 },
    { cosmeticKey: 'badge_veteran', weight: 25 },
    { cosmeticKey: 'QUEST_MAGE_MAN', weight: 20 },
  ],
  [ChestTier.EPIC]: [
    { cosmeticKey: 'frame_epic_flame', weight: 50 },
    { cosmeticKey: 'badge_legend', weight: 50 },
  ],
};

export function rollLootCosmeticKey(tier: ChestTier): string {
  const table = LOOT_TABLE_BY_TIER[tier];
  const total = table.reduce((sum, e) => sum + e.weight, 0);
  let roll = Math.random() * total;
  for (const entry of table) {
    roll -= entry.weight;
    if (roll <= 0) {
      return entry.cosmeticKey;
    }
  }
  return table[table.length - 1].cosmeticKey;
}

export function cosmeticTypeToCharacterField(
  type: CosmeticType,
): 'equippedPortraitFrameKey' | 'equippedProfileBackgroundKey' | 'equippedTitleBadgeKey' | null {
  switch (type) {
    case CosmeticType.PORTRAIT_FRAME:
      return 'equippedPortraitFrameKey';
    case CosmeticType.PROFILE_BACKGROUND:
      return 'equippedProfileBackgroundKey';
    case CosmeticType.TITLE_BADGE:
      return 'equippedTitleBadgeKey';
    default:
      return null;
  }
}
