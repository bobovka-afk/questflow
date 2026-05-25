export type XpGrantRewards = {
  taskXp: number;
  checkinXp: number;
  hpGained: number;
  checkinStreak: number;
  previousCheckinStreak: number;
  streakIncreased: boolean;
  streakMilestoneXp: number;
  streakMilestonesReached: number[];
};

export type CardCompletionResponse = {
  ok: boolean;
  rewards?: XpGrantRewards;
};

export function totalXpFromRewards(rewards: XpGrantRewards): number {
  return rewards.taskXp + rewards.checkinXp + rewards.streakMilestoneXp;
}

export type RewardToastStep =
  | { kind: 'checkin'; rewards: XpGrantRewards }
  | { kind: 'task'; rewards: XpGrantRewards };

export const REWARD_TOAST_VISIBLE_MS = 2800;
export const REWARD_TOAST_GAP_MS = 220;

export function buildRewardToastSteps(rewards: XpGrantRewards): RewardToastStep[] {
  const steps: RewardToastStep[] = [];
  if (
    rewards.checkinXp > 0 ||
    rewards.streakIncreased ||
    (rewards.streakMilestoneXp ?? 0) > 0
  ) {
    steps.push({ kind: 'checkin', rewards });
  }
  if (rewards.taskXp > 0 || rewards.hpGained > 0) {
    steps.push({ kind: 'task', rewards });
  }
  return steps;
}

export function hasRewardToast(rewards: XpGrantRewards): boolean {
  return buildRewardToastSteps(rewards).length > 0;
}

export function delayMs(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
