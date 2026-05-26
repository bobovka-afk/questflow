import { getYesterdayGameDayKey } from './game-day';

export function gameDayKeysEqual(a: Date, b: Date): boolean {
  return a.getTime() === b.getTime();
}

export function computeCheckinStreakAfterGrant(
  todayKey: Date,
  lastCheckinDayKey: Date | null,
  currentStreak: number,
  timeZone: string,
): {
  checkinStreak: number;
  streakIncreased: boolean;
  previousCheckinStreak: number;
} {
  const previousCheckinStreak = currentStreak;

  if (lastCheckinDayKey && gameDayKeysEqual(lastCheckinDayKey, todayKey)) {
    return {
      checkinStreak: currentStreak,
      streakIncreased: false,
      previousCheckinStreak,
    };
  }

  const yesterdayKey = getYesterdayGameDayKey(timeZone);
  if (lastCheckinDayKey && gameDayKeysEqual(lastCheckinDayKey, yesterdayKey)) {
    return {
      checkinStreak: currentStreak + 1,
      streakIncreased: true,
      previousCheckinStreak,
    };
  }

  return {
    checkinStreak: 1,
    streakIncreased: true,
    previousCheckinStreak,
  };
}
