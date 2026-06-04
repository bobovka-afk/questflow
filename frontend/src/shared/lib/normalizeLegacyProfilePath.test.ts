import { describe, expect, it } from 'vitest';
import { canonicalProfilePath } from './normalizeLegacyProfilePath';

describe('canonicalProfilePath', () => {
  it('rewrites legacy user profile paths', () => {
    expect(canonicalProfilePath('/profile/user/42')).toBe('/profile/42');
    expect(canonicalProfilePath('/profile/user/42/')).toBe('/profile/42');
    expect(canonicalProfilePath('/profile/user/7/character')).toBe('/profile/7/character');
    expect(canonicalProfilePath('/profile/user/7/character/')).toBe('/profile/7/character');
  });

  it('leaves canonical paths unchanged', () => {
    expect(canonicalProfilePath('/profile/42')).toBeNull();
    expect(canonicalProfilePath('/profile/me')).toBeNull();
  });
});
