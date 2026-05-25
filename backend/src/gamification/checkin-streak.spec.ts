import {
  computeCheckinStreakAfterGrant,
  gameDayKeysEqual,
} from './checkin-streak';
import { getTodayGameDayKey, getYesterdayGameDayKey } from './game-day';

describe('checkin-streak', () => {
  const tz = 'UTC';

  it('gameDayKeysEqual compares timestamps', () => {
    const a = new Date('2026-05-25T00:00:00.000Z');
    const b = new Date('2026-05-25T00:00:00.000Z');
    expect(gameDayKeysEqual(a, b)).toBe(true);
    expect(gameDayKeysEqual(a, new Date('2026-05-24T00:00:00.000Z'))).toBe(false);
  });

  it('increments streak when last check-in was yesterday', () => {
    const todayKey = getTodayGameDayKey(tz);
    const yesterdayKey = getYesterdayGameDayKey(tz);
    const result = computeCheckinStreakAfterGrant(todayKey, yesterdayKey, 3, tz);
    expect(result).toEqual({
      checkinStreak: 4,
      streakIncreased: true,
      previousCheckinStreak: 3,
    });
  });

  it('resets streak to 1 after a gap', () => {
    const todayKey = getTodayGameDayKey(tz);
    const oldKey = new Date('2020-01-01T00:00:00.000Z');
    const result = computeCheckinStreakAfterGrant(todayKey, oldKey, 10, tz);
    expect(result.checkinStreak).toBe(1);
    expect(result.streakIncreased).toBe(true);
    expect(result.previousCheckinStreak).toBe(10);
  });

  it('does not increment when already checked in today', () => {
    const todayKey = getTodayGameDayKey(tz);
    const result = computeCheckinStreakAfterGrant(todayKey, todayKey, 5, tz);
    expect(result).toEqual({
      checkinStreak: 5,
      streakIncreased: false,
      previousCheckinStreak: 5,
    });
  });
});
