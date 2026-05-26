export interface CharacterXpStats {
  currentXp: number;
  level: number;
  dailyTaskXpCount: number;
  health: number;
  checkinStreak: number;
  lastCheckinDayKey: Date | null;
}
