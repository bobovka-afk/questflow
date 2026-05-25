import {
  getNewlyReachedStreakMilestones,
  isStreakMilestoneDayKey,
  milestoneDaysFromDayKey,
  streakMilestoneDayKey,
} from './checkin-streak-milestones';

describe('checkin-streak-milestones', () => {
  it('streakMilestoneDayKey encodes milestone days in stable dayKey', () => {
    const key7 = streakMilestoneDayKey(7);
    expect(milestoneDaysFromDayKey(key7)).toBe(7);
    expect(isStreakMilestoneDayKey(key7)).toBe(true);
  });

  it('getNewlyReachedStreakMilestones returns crossed thresholds only', () => {
    expect(getNewlyReachedStreakMilestones(6, 7)).toEqual([{ days: 7, xp: 200 }]);
    expect(getNewlyReachedStreakMilestones(7, 8)).toEqual([]);
    expect(getNewlyReachedStreakMilestones(13, 14)).toEqual([{ days: 14, xp: 400 }]);
    expect(getNewlyReachedStreakMilestones(6, 30)).toEqual([
      { days: 7, xp: 200 },
      { days: 14, xp: 400 },
      { days: 30, xp: 800 },
    ]);
    expect(getNewlyReachedStreakMilestones(10, 1)).toEqual([]);
  });
});
