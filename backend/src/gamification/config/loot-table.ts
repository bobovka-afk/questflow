import {
  ChestTier,
  CosmeticType,
  GenderCharacter,
} from '../../generated/prisma/enums';

export function resolveLootCosmeticKey(
  rolledKey: string,
  _gender: GenderCharacter,
): string {
  return rolledKey;
}

export type LootEntry = {
  cosmeticKey: string;
  weight: number;
};

export const LOOT_TABLE_BY_TIER: Record<ChestTier, LootEntry[]> = {
  [ChestTier.COMMON]: [
    { cosmeticKey: 'frame_bronze', weight: 30 },
    { cosmeticKey: 'frame_silver', weight: 30 },
    { cosmeticKey: 'bg_meadow', weight: 25 },
    { cosmeticKey: 'bg_woods', weight: 20 },
    { cosmeticKey: 'bg_lake_forest', weight: 20 },
  ],
  [ChestTier.RARE]: [
    { cosmeticKey: 'frame_gold', weight: 50 },
    { cosmeticKey: 'bg_night', weight: 50 },
  ],
  [ChestTier.EPIC]: [{ cosmeticKey: 'frame_mystic', weight: 100 }],
};

export function rollLootCosmeticKey(
  tier: ChestTier,
  gender: GenderCharacter,
): string {
  const table = LOOT_TABLE_BY_TIER[tier];
  const total = table.reduce((sum, e) => sum + e.weight, 0);
  let roll = Math.random() * total;
  for (const entry of table) {
    roll -= entry.weight;
    if (roll <= 0) {
      return resolveLootCosmeticKey(entry.cosmeticKey, gender);
    }
  }
  const last = table[table.length - 1].cosmeticKey;
  return resolveLootCosmeticKey(last, gender);
}

export function cosmeticTypeToCharacterField(
  type: CosmeticType,
): 'equippedPortraitFrameKey' | 'equippedProfileBackgroundKey' | null {
  switch (type) {
    case CosmeticType.PORTRAIT_FRAME:
      return 'equippedPortraitFrameKey';
    case CosmeticType.PROFILE_BACKGROUND:
      return 'equippedProfileBackgroundKey';
    default:
      return null;
  }
}
