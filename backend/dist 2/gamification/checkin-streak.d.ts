export declare function gameDayKeysEqual(a: Date, b: Date): boolean;
export declare function computeCheckinStreakAfterGrant(todayKey: Date, lastCheckinDayKey: Date | null, currentStreak: number, timeZone: string): {
    checkinStreak: number;
    streakIncreased: boolean;
    previousCheckinStreak: number;
};
