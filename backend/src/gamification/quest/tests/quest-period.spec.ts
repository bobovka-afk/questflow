import {
  getDailyPeriodKey,
  getWeeklyPeriodKey,
  parseWeeklyPeriodKey,
} from '../quest-period';

describe('quest-period', () => {
  it('getDailyPeriodKey formats YYYY-MM-DD', () => {
    const key = getDailyPeriodKey(new Date('2026-05-26T12:00:00Z'), 'UTC');
    expect(key).toBe('2026-05-26');
  });

  it('getWeeklyPeriodKey returns ISO week', () => {
    const key = getWeeklyPeriodKey(new Date('2026-05-26T12:00:00Z'), 'UTC');
    expect(key).toMatch(/^\d{4}-W\d{2}$/);
  });

  it('parseWeeklyPeriodKey', () => {
    expect(parseWeeklyPeriodKey('2026-W22')).toEqual({
      year: 2026,
      week: 22,
    });
  });
});
