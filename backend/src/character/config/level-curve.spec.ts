import {
  MAX_LEVEL,
  XP_REQUIRED_BY_LEVEL,
  getRequiredXpForLevel,
} from './level-curve';

describe('level-curve', () => {
  it('returns XP for level 1 and below', () => {
    expect(getRequiredXpForLevel(0)).toBe(XP_REQUIRED_BY_LEVEL[1]);
    expect(getRequiredXpForLevel(1)).toBe(XP_REQUIRED_BY_LEVEL[1]);
  });

  it('returns XP for mid levels', () => {
    expect(getRequiredXpForLevel(10)).toBe(XP_REQUIRED_BY_LEVEL[10]);
  });

  it('caps at MAX_LEVEL', () => {
    expect(getRequiredXpForLevel(MAX_LEVEL)).toBe(
      XP_REQUIRED_BY_LEVEL[MAX_LEVEL],
    );
    expect(getRequiredXpForLevel(999)).toBe(XP_REQUIRED_BY_LEVEL[MAX_LEVEL]);
  });
});
