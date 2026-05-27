import { ChestTier, GenderCharacter } from '../../../generated/prisma/enums';
import {
  resolveLootCosmeticKey,
  resolveQuestMageLootKey,
  rollLootCosmeticKey,
} from '../loot-table';

describe('loot-table', () => {
  describe('resolveQuestMageLootKey', () => {
    it('maps male to QUEST_MAGE_MAN', () => {
      expect(resolveQuestMageLootKey(GenderCharacter.MALE)).toBe('QUEST_MAGE_MAN');
    });

    it('maps female to QUEST_MAGE_WOMAN', () => {
      expect(resolveQuestMageLootKey(GenderCharacter.FEMALE)).toBe(
        'QUEST_MAGE_WOMAN',
      );
    });
  });

  describe('resolveLootCosmeticKey', () => {
    it('resolves quest mage entry by gender', () => {
      expect(
        resolveLootCosmeticKey('QUEST_MAGE_MAN', GenderCharacter.FEMALE),
      ).toBe('QUEST_MAGE_WOMAN');
      expect(
        resolveLootCosmeticKey('QUEST_MAGE_MAN', GenderCharacter.MALE),
      ).toBe('QUEST_MAGE_MAN');
    });

    it('passes through other keys', () => {
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
  });
});
