import type { XpGrantRewards } from '../../gamification/interface/xp-grant-rewards.interface';
export interface CardCompletionResult {
    ok: boolean;
    rewards?: XpGrantRewards;
}
