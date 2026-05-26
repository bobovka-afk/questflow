import { CHECKIN_STREAK_MILESTONES } from './checkinStreakMilestones';

export type StreakMilestoneDef = (typeof CHECKIN_STREAK_MILESTONES)[number];

export type StreakMilestoneStatus = 'completed' | 'next' | 'upcoming';

export type StreakMilestoneRow = StreakMilestoneDef & {
  status: StreakMilestoneStatus;
  daysRemaining: number;
};

export function dayLabelRu(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'день';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'дня';
  return 'дней';
}

export function getNextStreakMilestone(streak: number): StreakMilestoneDef | null {
  return CHECKIN_STREAK_MILESTONES.find((m) => m.days > streak) ?? null;
}

export function allStreakMilestonesReached(streak: number): boolean {
  const last = CHECKIN_STREAK_MILESTONES[CHECKIN_STREAK_MILESTONES.length - 1];
  return streak >= last.days;
}

export function buildStreakMilestoneRows(streak: number): StreakMilestoneRow[] {
  const next = getNextStreakMilestone(streak);
  return CHECKIN_STREAK_MILESTONES.map((m) => {
    if (streak >= m.days) {
      return { ...m, status: 'completed' as const, daysRemaining: 0 };
    }
    if (next?.days === m.days) {
      return {
        ...m,
        status: 'next' as const,
        daysRemaining: Math.max(0, m.days - streak),
      };
    }
    return {
      ...m,
      status: 'upcoming' as const,
      daysRemaining: Math.max(0, m.days - streak),
    };
  });
}
