import type { XpGrantRewards } from '../../gamification/xp/interface/xp-grant-rewards.interface';

export interface CardCompletionResult {
  ok: boolean;
  rewards?: XpGrantRewards;
}
