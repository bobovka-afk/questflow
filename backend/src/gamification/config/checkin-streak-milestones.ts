export type CheckinStreakMilestoneConfig = {
  readonly days: number;
  readonly xp: number;
};

/** Streak thresholds for CHECKIN_STREAK (future achievements / quests). */
export const CHECKIN_STREAK_MILESTONES: readonly CheckinStreakMilestoneConfig[] = [
  { days: 7, xp: 200 },
  { days: 14, xp: 400 },
  { days: 30, xp: 800 },
] as const;

export const CHECKIN_STREAK_MILESTONE_DAY_KEYS = CHECKIN_STREAK_MILESTONES.map(
  (m) => m.days,
);
