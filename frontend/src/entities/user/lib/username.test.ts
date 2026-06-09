import { describe, expect, it } from 'vitest';
import { isValidUsername, normalizeUsername, profilePathForUsername } from './username';

describe('username', () => {
  it('normalizes and validates', () => {
    expect(normalizeUsername('  Hero_42 ')).toBe('hero_42');
    expect(isValidUsername('hero_42')).toBe(true);
    expect(isValidUsername('ab')).toBe(false);
  });

  it('builds profile path', () => {
    expect(profilePathForUsername('Hero')).toBe('/profile/@hero/character');
  });
});
