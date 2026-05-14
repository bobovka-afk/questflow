/** Держите в синхроне с backend/src/character/config/level-curve.ts */

export const MAX_LEVEL = 100;

export const XP_REQUIRED_BY_LEVEL: number[] = [
  0, 1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450, 1500, 1550, 1600, 1650, 1700,
  1750, 1800, 1850, 1900, 1950, 2000, 2050, 2100, 2150, 2200, 2250, 2300, 2350, 2400, 2450, 2500,
  2550, 2600, 2650, 2700, 2750, 2800, 2850, 2900, 2950, 3000, 3050, 3100, 3150, 3200, 3250, 3300,
  3350, 3400, 3450, 3500, 3550, 3600, 3650, 3700, 3750, 3800, 3850, 3900, 3950, 4000, 4050, 4100,
  4150, 4200, 4250, 4300, 4350, 4400, 4450, 4500, 4550, 4600, 4650, 4700, 4750, 4800, 4850, 4900,
  4950, 5000, 5050, 5100, 5150, 5200, 5250, 5300, 5350, 5400, 5450, 5500, 5550, 5600, 5650, 5700,
  5750, 5800, 5850, 5900, 5950,
];

export function getRequiredXpForLevel(level: number): number {
  if (level <= 1) return XP_REQUIRED_BY_LEVEL[1];
  if (level >= MAX_LEVEL) return XP_REQUIRED_BY_LEVEL[MAX_LEVEL];

  return XP_REQUIRED_BY_LEVEL[level];
}

/** currentXp — накопленный опыт в текущем уровне до следующего (как в БД после миграции с total_xp). */
export function getCharacterXpTowardNext(
  level: number,
  currentXp: number,
):
  | { atMaxLevel: true; pct: 100 }
  | { atMaxLevel: false; into: number; needed: number; pct: number } {
  if (level >= MAX_LEVEL) {
    return { atMaxLevel: true, pct: 100 };
  }
  const needed = getRequiredXpForLevel(level);
  const into = Math.min(Math.max(0, currentXp), needed);
  const pct = needed > 0 ? Math.min(100, (into / needed) * 100) : 100;
  return { atMaxLevel: false, into, needed, pct };
}
