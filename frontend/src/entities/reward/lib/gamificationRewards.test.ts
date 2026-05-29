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

  it('omits task toast when xp notifications are disabled', () => {
    const rewards = makeRewards({ taskXp: 100, hpGained: 5 });
    const steps = buildRewardToastSteps(rewards, { xpGainNotifications: false });
    expect(steps).toEqual([]);
  });

  it('keeps checkin toast without xp blocks when only streak changes', () => {
    const rewards = makeRewards({
      checkinXp: 100,
      checkinStreak: 2,
      previousCheckinStreak: 1,
      streakIncreased: true,
    });
    const steps = buildRewardToastSteps(rewards, { xpGainNotifications: false });
    expect(steps).toHaveLength(1);
    expect(steps[0]?.kind).toBe('checkin');
    if (steps[0]?.kind === 'checkin') {
      expect(steps[0].showXp).toBe(false);
      expect(steps[0].disableStreakAnimation).toBe(false);
    }
  });

  it('disables streak animation when preference is off', () => {
    const rewards = makeRewards({
      checkinXp: 100,
      streakIncreased: true,
      checkinStreak: 2,
      previousCheckinStreak: 1,
    });
    const steps = buildRewardToastSteps(rewards, { checkinAnimationOnCardClose: false });
    expect(steps[0]?.kind).toBe('checkin');
    if (steps[0]?.kind === 'checkin') {
      expect(steps[0].disableStreakAnimation).toBe(true);
    }
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
