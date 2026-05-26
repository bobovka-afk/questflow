import {
  getGameDayBounds,
  getGameDayKey,
  getTodayGameDayKey,
  getYesterdayGameDayKey,
} from '../game-day';

describe('game-day', () => {
  describe('getGameDayKey', () => {
    it('uses calendar date in Europe/Moscow', () => {
      const instant = new Date('2026-05-24T22:00:00.000Z');
      const key = getGameDayKey(instant, 'Europe/Moscow');
      expect(key.toISOString()).toBe('2026-05-25T00:00:00.000Z');
    });

    it('uses calendar date in UTC', () => {
      const instant = new Date('2026-05-24T22:00:00.000Z');
      const key = getGameDayKey(instant, 'UTC');
      expect(key.toISOString()).toBe('2026-05-24T00:00:00.000Z');
    });
  });

  describe('getTodayGameDayKey', () => {
    it('returns a UTC midnight date', () => {
      const key = getTodayGameDayKey('UTC');
      expect(key.getUTCHours()).toBe(0);
      expect(key.getUTCMinutes()).toBe(0);
    });
  });

  describe('getYesterdayGameDayKey', () => {
    it('is one calendar day before today key', () => {
      const today = getTodayGameDayKey('UTC');
      const yesterday = getYesterdayGameDayKey('UTC');
      expect(yesterday.getTime()).toBe(today.getTime() - 24 * 60 * 60 * 1000);
    });
  });

  describe('getGameDayBounds', () => {
    it('covers Moscow local day for events without dayKey', () => {
      const dayKey = new Date('2026-05-25T00:00:00.000Z');
      const { start, end } = getGameDayBounds(dayKey, 'Europe/Moscow');

      const eveningUtc = new Date('2026-05-24T22:00:00.000Z');
      expect(eveningUtc.getTime()).toBeGreaterThanOrEqual(start.getTime());
      expect(eveningUtc.getTime()).toBeLessThan(end.getTime());

      const beforeDay = new Date('2026-05-24T20:00:00.000Z');
      expect(beforeDay.getTime()).toBeLessThan(start.getTime());
    });
  });
});
