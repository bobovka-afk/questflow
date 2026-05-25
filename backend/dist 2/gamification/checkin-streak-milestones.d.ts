import type { CheckinStreakMilestoneConfig } from './config/checkin-streak-milestones';
export declare function streakMilestoneDayKey(milestoneDays: number): Date;
export declare function isStreakMilestoneDayKey(dayKey: Date): boolean;
export declare function milestoneDaysFromDayKey(dayKey: Date): number | null;
export declare function getNewlyReachedStreakMilestones(previousStreak: number, newStreak: number): CheckinStreakMilestoneConfig[];
