import { describe, expect, it } from 'vitest';
import { buildChestLootOdds } from './chestLootOdds';

describe('buildChestLootOdds', () => {
  it('splits 80/20 for common chest', () => {
    const odds = buildChestLootOdds('COMMON');
    const higher = odds.sections.find((s) => s.poolPercent === 20);
    const same = odds.sections.find((s) => s.poolPercent === 80);
    expect(higher?.rows).toHaveLength(3);
    expect(higher?.rows.every((r) => r.cosmeticTier === 'RARE')).toBe(true);
    expect(higher?.rows.some((r) => r.cosmeticTier === 'EPIC')).toBe(false);
    expect(same?.rows.length).toBe(5);
    const higherSum = higher!.rows.reduce((sum, r) => sum + r.percent, 0);
    const sameSum = same!.rows.reduce((sum, r) => sum + r.percent, 0);
    expect(higherSum).toBeCloseTo(20, 5);
    expect(sameSum).toBeCloseTo(80, 5);
    expect(higher!.rows[0].percent).toBeCloseTo(20 / higher!.rows.length, 5);
  });

  it('rare chest higher pool is epic only', () => {
    const odds = buildChestLootOdds('RARE');
    const higher = odds.sections.find((s) => s.poolPercent === 20);
    expect(higher?.rows).toHaveLength(1);
    expect(higher?.rows[0].cosmeticTier).toBe('EPIC');
  });

  it('epic chest is 100% epic only', () => {
    const odds = buildChestLootOdds('EPIC');
    expect(odds.sections).toHaveLength(1);
    expect(odds.sections[0].rows).toHaveLength(1);
    expect(odds.sections[0].rows[0].percent).toBe(100);
  });
});
