import type { Character } from '../../generated/prisma/client';
import type { XpGrantRewards } from './xp-grant-rewards.interface';

export interface XpGrantResult {
  character: Character;
  rewards: XpGrantRewards;
}
