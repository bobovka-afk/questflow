import {
  CHARACTER_GRACE_PERIOD_MS,
  CHARACTER_HEALTH_MAX,
  DAILY_ACTIVITY_XP_MAX,
  HP_GAIN_PER_XP_EVENT,
  HP_INACTIVITY_PENALTY,
  XP_DAILY_CHECKIN,
  XP_PER_TASK_COMPLETED,
} from '../rewards';

describe('rewards', () => {
  it('defines task XP and daily activity limit', () => {
    expect(XP_PER_TASK_COMPLETED).toBe(100);
    expect(XP_DAILY_CHECKIN).toBe(100);
    expect(DAILY_ACTIVITY_XP_MAX).toBe(500);
  });

  it('defines HP reward caps for XP events', () => {
    expect(HP_GAIN_PER_XP_EVENT).toBe(5);
    expect(HP_INACTIVITY_PENALTY).toBe(5);
    expect(CHARACTER_HEALTH_MAX).toBe(100);
    expect(CHARACTER_GRACE_PERIOD_MS).toBe(24 * 60 * 60 * 1000);
  });
});
