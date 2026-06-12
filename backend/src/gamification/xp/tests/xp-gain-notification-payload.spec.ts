import { XpEventType } from '../../../generated/prisma/enums';
import { buildXpGainNotificationPayload } from '../xp-gain-notification-payload';
import type { XpGrantRewards } from '../interface/xp-grant-rewards.interface';

function emptyRewards(overrides: Partial<XpGrantRewards> = {}): XpGrantRewards {
  return {
    taskXp: 0,
    checkinXp: 0,
    hpGained: 0,
    manaGained: 0,
    checkinStreak: 0,
    previousCheckinStreak: 0,
    streakIncreased: false,
    streakMilestoneXp: 0,
    streakMilestonesReached: [],
    ...overrides,
  };
}

describe('buildXpGainNotificationPayload', () => {
  it('returns null when no xp was granted', () => {
    expect(
      buildXpGainNotificationPayload(
        emptyRewards(),
        XpEventType.TASK_COMPLETED,
      ),
    ).toBeNull();
  });

  it('lists card task only', () => {
    expect(
      buildXpGainNotificationPayload(
        emptyRewards({ taskXp: 100 }),
        XpEventType.TASK_COMPLETED,
      ),
    ).toEqual({
      xpAmount: 100,
      source: XpEventType.TASK_COMPLETED,
      sources: [XpEventType.TASK_COMPLETED],
    });
  });

  it('lists habit plus auto daily checkin', () => {
    expect(
      buildXpGainNotificationPayload(
        emptyRewards({ taskXp: 25, checkinXp: 100 }),
        XpEventType.HABIT_POSITIVE,
      ),
    ).toEqual({
      xpAmount: 125,
      source: XpEventType.HABIT_POSITIVE,
      sources: [XpEventType.HABIT_POSITIVE, XpEventType.DAILY_CHECKIN],
    });
  });

  it('includes streak milestone source', () => {
    expect(
      buildXpGainNotificationPayload(
        emptyRewards({ checkinXp: 100, streakMilestoneXp: 50 }),
        XpEventType.DAILY_CHECKIN,
      ),
    ).toEqual({
      xpAmount: 150,
      source: XpEventType.DAILY_CHECKIN,
      sources: [XpEventType.DAILY_CHECKIN, XpEventType.CHECKIN_STREAK],
    });
  });
});
