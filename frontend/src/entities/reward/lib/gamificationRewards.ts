export type XpGrantRewards = {
  taskXp: number;
  checkinXp: number;
  hpGained: number;
  manaGained?: number;
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
  | {
      kind: 'checkin';
      rewards: XpGrantRewards;
      showXp?: boolean;
      disableStreakAnimation?: boolean;
    }
  | { kind: 'task'; rewards: XpGrantRewards };

export type RewardToastPreferences = {
  checkinAnimationOnCardClose?: boolean;
  xpGainNotifications?: boolean;
};

function hasCheckinToastContent(
  rewards: XpGrantRewards,
  showXp: boolean,
): boolean {
  if (
    showXp &&
    (rewards.checkinXp > 0 || (rewards.streakMilestoneXp ?? 0) > 0)
  ) {
    return true;
  }
  return (
    rewards.streakIncreased ||
    rewards.checkinStreak > 0 ||
    (rewards.streakMilestonesReached?.length ?? 0) > 0
  );
}

export const REWARD_TOAST_VISIBLE_MS = 2800;
export const REWARD_TOAST_GAP_MS = 220;

export function buildRewardToastSteps(
  rewards: XpGrantRewards,
  prefs?: RewardToastPreferences,
): RewardToastStep[] {
  const showXp = prefs?.xpGainNotifications ?? true;
  const checkinAnimation = prefs?.checkinAnimationOnCardClose ?? true;
  const steps: RewardToastStep[] = [];

  if (hasCheckinToastContent(rewards, showXp)) {
    steps.push({
      kind: 'checkin',
      rewards,
      showXp,
      disableStreakAnimation: !checkinAnimation,
    });
  }
  if (showXp && (rewards.taskXp > 0 || rewards.hpGained > 0)) {
    steps.push({ kind: 'task', rewards });
  }
  return steps;
}

export function hasRewardToast(
  rewards: XpGrantRewards,
  prefs?: RewardToastPreferences,
): boolean {
  return buildRewardToastSteps(rewards, prefs).length > 0;
}

export function delayMs(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
