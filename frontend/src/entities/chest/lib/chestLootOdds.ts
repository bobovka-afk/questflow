import type { ChestTier } from '@entities/quest';
import { CHEST_TIER_LABEL_RU } from '@entities/quest';

/** Ключи из loot-table + сиды (без значков TITLE_BADGE). */
const COSMETIC_CATALOG: Record<
  string,
  { nameRu: string; tier: ChestTier }
> = {
  frame_bronze: { nameRu: 'Бронзовая рамка', tier: 'COMMON' },
  frame_silver: { nameRu: 'Серебряная рамка', tier: 'COMMON' },
  bg_meadow: { nameRu: 'Фон «Луг»', tier: 'COMMON' },
  bg_woods: { nameRu: 'Фон «Лес»', tier: 'COMMON' },
  bg_lake_forest: { nameRu: 'Фон «Озеро в лесу»', tier: 'COMMON' },
  frame_gold: { nameRu: 'Золотая рамка', tier: 'RARE' },
  bg_night: { nameRu: 'Фон «Ночь»', tier: 'RARE' },
  QUEST_MAGE_MAN: { nameRu: 'Образ мага (квест)', tier: 'RARE' },
  frame_mystic: { nameRu: 'Мистическая рамка', tier: 'EPIC' },
};

const LOOT_KEYS_BY_CHEST: Record<ChestTier, string[]> = {
  COMMON: [
    'frame_bronze',
    'frame_silver',
    'bg_meadow',
    'bg_woods',
    'bg_lake_forest',
  ],
  RARE: ['frame_gold', 'bg_night', 'QUEST_MAGE_MAN'],
  EPIC: ['frame_mystic'],
};

const HIGHER_POOL_PERCENT = 20;
const SAME_POOL_PERCENT = 80;

const TIER_RANK: Record<ChestTier, number> = {
  COMMON: 0,
  RARE: 1,
  EPIC: 2,
};

export type ChestLootOddsRow = {
  key: string;
  nameRu: string;
  cosmeticTier: ChestTier;
  percent: number;
};

export type ChestLootOddsSection = {
  title: string;
  poolPercent: number;
  rows: ChestLootOddsRow[];
};

export type ChestLootOddsView = {
  chestTier: ChestTier;
  chestTitleRu: string;
  sections: ChestLootOddsSection[];
  /** Плоский список: сначала более редкие, затем своя редкость (для пагинации). */
  flatRows: Array<ChestLootOddsRow & { sectionKey: string }>;
};

function tierOneAbove(chestTier: ChestTier): ChestTier | null {
  if (chestTier === 'COMMON') return 'RARE';
  if (chestTier === 'RARE') return 'EPIC';
  return null;
}

function lootKeysForHigherPools(chestTier: ChestTier): string[] {
  const aboveTier = tierOneAbove(chestTier);
  if (!aboveTier) return [];
  return LOOT_KEYS_BY_CHEST[aboveTier];
}

function catalogEntry(lootKey: string): { key: string; nameRu: string; tier: ChestTier } | null {
  const entry = COSMETIC_CATALOG[lootKey];
  if (!entry) return null;
  return { key: lootKey, nameRu: entry.nameRu, tier: entry.tier };
}

function splitPoolPercent(
  keys: string[],
  poolPercent: number,
  chestTier: ChestTier,
  minTier: 'same' | 'higher',
): ChestLootOddsRow[] {
  const items = keys
    .map(catalogEntry)
    .filter((item): item is NonNullable<typeof item> => {
      if (!item) return false;
      if (minTier === 'same') return item.tier === chestTier;
      const aboveTier = tierOneAbove(chestTier);
      return aboveTier !== null && item.tier === aboveTier;
    });

  if (items.length === 0) return [];

  const each = poolPercent / items.length;
  return items
    .map((item) => ({
      key: item.key,
      nameRu: item.nameRu,
      cosmeticTier: item.tier,
      percent: each,
    }))
    .sort((a, b) => {
      const tierDiff = TIER_RANK[b.cosmeticTier] - TIER_RANK[a.cosmeticTier];
      if (tierDiff !== 0) return tierDiff;
      return a.nameRu.localeCompare(b.nameRu, 'ru');
    });
}

export function buildChestLootOdds(chestTier: ChestTier): ChestLootOddsView {
  const chestTitleRu = `${CHEST_TIER_LABEL_RU[chestTier]} сундук`;
  const sections: ChestLootOddsSection[] = [];

  if (chestTier === 'EPIC') {
    const rows = splitPoolPercent(LOOT_KEYS_BY_CHEST.EPIC, 100, chestTier, 'same');
    sections.push({
      title: 'Эпическая редкость',
      poolPercent: 100,
      rows,
    });
  } else {
    const higherKeys = lootKeysForHigherPools(chestTier);
    const higherRows = splitPoolPercent(higherKeys, HIGHER_POOL_PERCENT, chestTier, 'higher');
    if (higherRows.length > 0) {
      sections.push({
        title: `Выше редкости сундука (${HIGHER_POOL_PERCENT}%)`,
        poolPercent: HIGHER_POOL_PERCENT,
        rows: higherRows,
      });
    }

    const sameRows = splitPoolPercent(
      LOOT_KEYS_BY_CHEST[chestTier],
      SAME_POOL_PERCENT,
      chestTier,
      'same',
    );
    sections.push({
      title: `${CHEST_TIER_LABEL_RU[chestTier]} (${SAME_POOL_PERCENT}%)`,
      poolPercent: SAME_POOL_PERCENT,
      rows: sameRows,
    });
  }

  const flatRows: ChestLootOddsView['flatRows'] = [];
  for (const section of sections) {
    const sectionKey = section.title;
    for (const row of section.rows) {
      flatRows.push({ ...row, sectionKey });
    }
  }

  return { chestTier, chestTitleRu, sections, flatRows };
}

export function formatLootOddsPercent(percent: number): string {
  const rounded = Math.round(percent * 10) / 10;
  return Number.isInteger(rounded) ? `${rounded}%` : `${rounded.toFixed(1)}%`;
}

/** Без прокрутки в модалке — только стрелки; влезает в окно при компактном списке. */
export const CHEST_LOOT_ODDS_ROWS_PER_PAGE = 7;
