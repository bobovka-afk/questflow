import type { ChestTier } from '../../generated/prisma/enums';

export type BossTemplate = {
  key: string;
  nameRu: string;
  descriptionRu: string;
  chestTier: ChestTier;
  sortOrder: number;
};

export const BOSS_TEMPLATES: BossTemplate[] = [
  {
    key: 'rust_king',
    nameRu: 'Rust King',
    descriptionRu: 'Easy boss for your first raid. Chest with basic raid cosmetics.',
    chestTier: 'COMMON',
    sortOrder: 1,
  },
  {
    key: 'colossus',
    nameRu: 'Colossus',
    descriptionRu: 'Medium boss. Rare boss chest with improved loot.',
    chestTier: 'RARE',
    sortOrder: 2,
  },
  {
    key: 'maw_of_void',
    nameRu: 'Maw of the Void',
    descriptionRu:
      'Hard boss. A rift between worlds — epic boss chest for an experienced party.',
    chestTier: 'EPIC',
    sortOrder: 3,
  },
];

export function getBossTemplate(key: string): BossTemplate | undefined {
  return BOSS_TEMPLATES.find((b) => b.key === key);
}
