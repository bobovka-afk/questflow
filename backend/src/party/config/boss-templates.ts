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
    nameRu: 'Ржавый Король',
    descriptionRu: 'Лёгкий босс для первого рейда. Сундук с базовой рейдовой косметикой.',
    chestTier: 'COMMON',
    sortOrder: 1,
  },
  {
    key: 'colossus',
    nameRu: 'Залмарат',
    descriptionRu: 'Средний босс. Редкий boss-сундук с улучшенным лутом.',
    chestTier: 'RARE',
    sortOrder: 2,
  },
  {
    key: 'maw_of_void',
    nameRu: 'Бездна-Пасть',
    descriptionRu:
      'Тяжёлый босс. Разрыв между мирами — эпический boss-сундук для опытной пати.',
    chestTier: 'EPIC',
    sortOrder: 3,
  },
];

export function getBossTemplate(key: string): BossTemplate | undefined {
  return BOSS_TEMPLATES.find((b) => b.key === key);
}
