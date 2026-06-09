import { describe, expect, it } from 'vitest';
import { canonicalProfilePath } from './normalizeLegacyProfilePath';

describe('canonicalProfilePath', () => {
  it('rewrites legacy user profile paths to character', () => {
    expect(canonicalProfilePath('/profile/user/42')).toBe('/profile/42/character');
    expect(canonicalProfilePath('/profile/user/42/')).toBe('/profile/42/character');
    expect(canonicalProfilePath('/profile/user/7/character')).toBe('/profile/7/character');
    expect(canonicalProfilePath('/profile/user/7/character/')).toBe('/profile/7/character');
  });

  it('rewrites account hub and bare user paths', () => {
    expect(canonicalProfilePath('/profile')).toBe('/profile/character');
    expect(canonicalProfilePath('/profile/me')).toBe('/profile/character');
    expect(canonicalProfilePath('/profile/42')).toBe('/profile/42/character');
    expect(canonicalProfilePath('/profile/@hero')).toBe('/profile/@hero/character');
  });

  it('leaves canonical character paths unchanged', () => {
    expect(canonicalProfilePath('/profile/character')).toBeNull();
    expect(canonicalProfilePath('/profile/7/character')).toBeNull();
    expect(canonicalProfilePath('/profile/@hero/character')).toBeNull();
  });
});
