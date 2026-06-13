import { ChestTier } from '../../generated/prisma/enums';

export const DUST_FOR_DUPLICATE_BY_TIER: Record<ChestTier, number> = {
  [ChestTier.COMMON]: 15,
  [ChestTier.RARE]: 40,
  [ChestTier.EPIC]: 100,
};

export type DustChestShopOption = {
  tier: ChestTier;
  cost: number;
  titleRu: string;
  descriptionRu: string;
};

export const DUST_CHEST_SHOP_OPTIONS: DustChestShopOption[] = [
  {
    tier: ChestTier.COMMON,
    cost: 50,
    titleRu: 'Common chest',
    descriptionRu: 'Frame, badge, or background',
  },
  {
    tier: ChestTier.RARE,
    cost: 120,
    titleRu: 'Rare chest',
    descriptionRu: 'Improved cosmetic or avatar',
  },
  {
    tier: ChestTier.EPIC,
    cost: 250,
    titleRu: 'Epic chest',
    descriptionRu: 'Exclusive reward',
  },
];
