import { ChestTier, GenderCharacter } from '../../generated/prisma/enums';
import {
  type LootEntry,
  rollLootCosmeticKey,
  resolveLootCosmeticKey,
} from './loot-table';

/** Per-boss loot weights (tier still gates fallback table). */
export const BOSS_LOOT_BY_KEY: Record<string, LootEntry[]> = {
  nasadka: [
    { cosmeticKey: 'frame_bronze', weight: 40 },
    { cosmeticKey: 'bg_meadow', weight: 35 },
    { cosmeticKey: 'bg_woods', weight: 25 },
  ],
  borovik: [
    { cosmeticKey: 'frame_silver', weight: 30 },
    { cosmeticKey: 'frame_gold', weight: 35 },
    { cosmeticKey: 'bg_night', weight: 35 },
  ],
  mukhomor: [
    { cosmeticKey: 'frame_mystic', weight: 50 },
    { cosmeticKey: 'bg_lake_forest', weight: 50 },
  ],
};

export function parseBossKeyFromChestSource(source: string): string | null {
  if (!source.startsWith('BOSS:')) return null;
  const parts = source.split(':');
  return parts[1] ?? null;
}

export function rollBossLootCosmeticKey(
  bossKey: string,
  tier: ChestTier,
  gender: GenderCharacter,
): string {
  const table = BOSS_LOOT_BY_KEY[bossKey];
  if (!table?.length) {
    return rollLootCosmeticKey(tier, gender);
  }
  const total = table.reduce((sum, e) => sum + e.weight, 0);
  let roll = Math.random() * total;
  for (const entry of table) {
    roll -= entry.weight;
    if (roll <= 0) {
      return resolveLootCosmeticKey(entry.cosmeticKey, gender);
    }
  }
  const last = table[table.length - 1]!.cosmeticKey;
  return resolveLootCosmeticKey(last, gender);
}
