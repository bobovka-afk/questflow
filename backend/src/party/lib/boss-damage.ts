import {
  BOSS_DAILY_PARTY_BUDGET_PCT,
  BOSS_MAX_ATTACKS_PER_DAY,
} from '../../gamification/config/rewards';

export function calcDamagePerAttack(activeMemberCount: number): number {
  const members = Math.max(1, activeMemberCount);
  const damage =
    BOSS_DAILY_PARTY_BUDGET_PCT / (members * BOSS_MAX_ATTACKS_PER_DAY);
  return Math.round(damage * 10000) / 10000;
}

export function buildBossChestSource(bossKey: string, raidId: number): string {
  return `BOSS:${bossKey}:${raidId}`;
}
