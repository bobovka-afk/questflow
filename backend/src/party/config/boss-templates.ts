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
    descriptionRu: 'Простой босс для первого рейда. Сундук с базовой рейдовой косметикой.',
    chestTier: 'COMMON',
    sortOrder: 1,
  },
  {
    key: 'colossus',
    nameRu: 'Colossus',
    descriptionRu: 'Босс средней сложности. Редкий босс-сундук с улучшенной добычей.',
    chestTier: 'RARE',
    sortOrder: 2,
  },
  {
    key: 'maw_of_void',
    nameRu: 'Maw of the Void',
    descriptionRu:
      'Сложный босс. Разлом между мирами — эпический босс-сундук для опытной команды.',
    chestTier: 'EPIC',
    sortOrder: 3,
  },
];

export function getBossTemplate(key: string): BossTemplate | undefined {
  return BOSS_TEMPLATES.find((b) => b.key === key);
}
