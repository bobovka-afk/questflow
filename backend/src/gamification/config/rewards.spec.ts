import {
  CHARACTER_HEALTH_MAX,
  DAILY_TASK_XP_COMPLETIONS_MAX,
  HP_GAIN_PER_XP_EVENT,
  XP_PER_TASK_COMPLETED,
} from './rewards';

describe('rewards', () => {
  it('defines task XP and daily limit', () => {
    expect(XP_PER_TASK_COMPLETED).toBe(100);
    expect(DAILY_TASK_XP_COMPLETIONS_MAX).toBe(5);
  });

  it('defines HP reward caps for XP events', () => {
    expect(HP_GAIN_PER_XP_EVENT).toBe(5);
    expect(CHARACTER_HEALTH_MAX).toBe(100);
  });
});
