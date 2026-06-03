import {
  BOSS_DAILY_PARTY_BUDGET_PCT,
  BOSS_MAX_ATTACKS_PER_DAY,
} from '../../../gamification/config/rewards';
import { buildBossChestSource, calcDamagePerAttack } from '../boss-damage';

describe('boss-damage', () => {
  it('calcDamagePerAttack scales down with party size', () => {
    const two = calcDamagePerAttack(2);
    const eight = calcDamagePerAttack(8);
    expect(two).toBeGreaterThan(eight);
    expect(two).toBe(
      BOSS_DAILY_PARTY_BUDGET_PCT / (2 * BOSS_MAX_ATTACKS_PER_DAY),
    );
  });

  it('full party daily budget matches constant', () => {
    for (const size of [2, 5, 8]) {
      const perHit = calcDamagePerAttack(size);
      const daily = perHit * size * BOSS_MAX_ATTACKS_PER_DAY;
      expect(Math.round(daily * 100) / 100).toBe(BOSS_DAILY_PARTY_BUDGET_PCT);
    }
  });

  it('buildBossChestSource is unique per raid', () => {
    expect(buildBossChestSource('nasadka', 1)).toBe('BOSS:nasadka:1');
  });
});
