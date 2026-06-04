import { getNextGameDayResetAt } from '../next-game-day-reset';

describe('getNextGameDayResetAt', () => {
  it('returns a future instant', () => {
    const now = new Date('2026-06-04T12:00:00.000Z');
    const next = getNextGameDayResetAt('UTC', now);
    expect(next.getTime()).toBeGreaterThan(now.getTime());
    expect(next.getTime() - now.getTime()).toBeLessThan(24 * 60 * 60 * 1000);
  });
});
