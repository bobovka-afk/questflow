import type { ChestTier } from '../../../generated/prisma/enums';

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

export type PurchaseChestWithDustResult = {
  chestId: number;
  tier: ChestTier;
  dustSpent: number;
  dustBalance: number;
};
