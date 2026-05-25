import { CHECKIN_STREAK_MILESTONES } from './config/checkin-streak-milestones';
import type { CheckinStreakMilestoneConfig } from './config/checkin-streak-milestones';

const MILESTONE_DAY_KEY_EPOCH_MS = Date.UTC(2000, 0, 1);

export function streakMilestoneDayKey(milestoneDays: number): Date {
  return new Date(MILESTONE_DAY_KEY_EPOCH_MS + milestoneDays * 86_400_000);
}

export function isStreakMilestoneDayKey(dayKey: Date): boolean {
  return milestoneDaysFromDayKey(dayKey) != null;
}

export function milestoneDaysFromDayKey(dayKey: Date): number | null {
  const diffMs = dayKey.getTime() - MILESTONE_DAY_KEY_EPOCH_MS;
  if (diffMs <= 0 || diffMs % 86_400_000 !== 0) {
    return null;
  }
  const days = diffMs / 86_400_000;
  return CHECKIN_STREAK_MILESTONES.some((m) => m.days === days) ? days : null;
}

export function getNewlyReachedStreakMilestones(
  previousStreak: number,
  newStreak: number,
): CheckinStreakMilestoneConfig[] {
  return CHECKIN_STREAK_MILESTONES.filter(
    (m) => newStreak >= m.days && previousStreak < m.days,
  );
}
