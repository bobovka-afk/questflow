import { describe, expect, it } from 'vitest';
import { buildRewardToastSteps, hasRewardToast, totalXpFromRewards, type XpGrantRewards } from './gamificationRewards';

function makeRewards(overrides: Partial<XpGrantRewards> = {}): XpGrantRewards {
  return {
    taskXp: 0,
    checkinXp: 0,
    hpGained: 0,
    checkinStreak: 0,
    previousCheckinStreak: 0,
    streakIncreased: false,
    streakMilestoneXp: 0,
    streakMilestonesReached: [],
    ...overrides,
  };
}

describe('gamificationRewards', () => {
  it('builds both checkin and task toast steps', () => {
    const rewards = makeRewards({
      taskXp: 100,
      checkinXp: 100,
      hpGained: 5,
      checkinStreak: 3,
      previousCheckinStreak: 2,
      streakIncreased: true,
    });

    const steps = buildRewardToastSteps(rewards);
    expect(steps.map((s) => s.kind)).toEqual(['checkin', 'task']);
  });

  it('computes total xp and toast visibility', () => {
    const rewards = makeRewards({
      taskXp: 100,
      checkinXp: 100,
      streakMilestoneXp: 200,
    });

    expect(totalXpFromRewards(rewards)).toBe(400);
    expect(hasRewardToast(rewards)).toBe(true);
    expect(hasRewardToast(makeRewards())).toBe(false);
  });
});
