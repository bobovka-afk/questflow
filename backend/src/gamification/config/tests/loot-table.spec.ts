import { ChestTier, GenderCharacter } from '../../../generated/prisma/enums';
import {
  resolveLootCosmeticKey,
  rollLootCosmeticKey,
} from '../loot-table';

describe('loot-table', () => {
  describe('resolveLootCosmeticKey', () => {
    it('passes through cosmetic keys', () => {
      expect(resolveLootCosmeticKey('frame_gold', GenderCharacter.FEMALE)).toBe(
        'frame_gold',
      );
    });
  });

  describe('rollLootCosmeticKey', () => {
    it('returns keys from the tier table', () => {
      const spy = jest.spyOn(Math, 'random').mockReturnValue(0);
      expect(rollLootCosmeticKey(ChestTier.COMMON, GenderCharacter.MALE)).toBe(
        'frame_bronze',
      );
      spy.mockRestore();
    });

    it('rolls only rare frames and backgrounds from rare chests', () => {
      const spy = jest.spyOn(Math, 'random').mockReturnValue(0.99);
      const key = rollLootCosmeticKey(ChestTier.RARE, GenderCharacter.MALE);
      expect(['frame_gold', 'bg_night']).toContain(key);
      spy.mockRestore();
    });
  });
});
