export interface CharacterXpStats {
  currentXp: number;
  level: number;
  dailyActivityXpEarned: number;
  health: number;
  manaCurrent: number;
  checkinStreak: number;
  lastCheckinDayKey: Date | null;
}
