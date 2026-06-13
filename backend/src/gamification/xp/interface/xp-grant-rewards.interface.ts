export interface XpGrantRewards {
  taskXp: number;
  checkinXp: number;
  hpGained: number;
  manaGained: number;
  checkinStreak: number;
  previousCheckinStreak: number;
  streakIncreased: boolean;
  /** XP for newly reached streak milestones at 7 / 14 / 30 days. */
  streakMilestoneXp: number;
  /** Streak milestones credited in this transaction (for UI / future achievements). */
  streakMilestonesReached: number[];
}
