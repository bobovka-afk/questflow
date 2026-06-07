import { resolveGameDayTimeZone } from '../resolve-game-day-timezone';

describe('resolveGameDayTimeZone', () => {
  it('returns UTC for empty values', () => {
    expect(resolveGameDayTimeZone(undefined)).toBe('UTC');
    expect(resolveGameDayTimeZone('')).toBe('UTC');
    expect(resolveGameDayTimeZone('   ')).toBe('UTC');
  });

  it('accepts valid IANA timezone', () => {
    expect(resolveGameDayTimeZone('Europe/Moscow')).toBe('Europe/Moscow');
  });

  it('falls back to UTC for invalid timezone', () => {
    const warn = jest.fn();
    expect(resolveGameDayTimeZone('Europe', { warn })).toBe('UTC');
    expect(warn).toHaveBeenCalled();
  });
});
