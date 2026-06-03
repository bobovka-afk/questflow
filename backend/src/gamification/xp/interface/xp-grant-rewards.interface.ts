export interface XpGrantRewards {
  taskXp: number;
  checkinXp: number;
  hpGained: number;
  manaGained: number;
  checkinStreak: number;
  previousCheckinStreak: number;
  streakIncreased: boolean;
  /** XP за впервые достигнутые пороги серии 7 / 14 / 30. */
  streakMilestoneXp: number;
  /** Какие пороги серии засчитаны в этой транзакции (для UI / будущих ачивок). */
  streakMilestonesReached: number[];
}
