import { API_URL } from '@shared/api';
import type { ChestTier } from '@entities/quest';

/** Отдельные PNG на каждый шаг tap-to-open (вариант B). */
const CHEST_TAP_FRAMES: Partial<Record<ChestTier, string[]>> = {
  COMMON: [
    'chests/common/0.png',
    'chests/common/1.png',
    'chests/common/2.png',
    'chests/common/3.png',
    'chests/common/4.png',
  ],
  /** Закрытый кадр — `1.png` (аналог `common/0.png`), тапы `2`–`5`. */
  RARE: [
    'chests/rare/1.png',
    'chests/rare/2.png',
    'chests/rare/3.png',
    'chests/rare/4.png',
    'chests/rare/5.png',
  ],
  /** Закрытый кадр — `1.png`, тапы `2`–`4`. */
  EPIC: [
    'chests/epic/1.png',
    'chests/epic/2.png',
    'chests/epic/3.png',
    'chests/epic/4.png',
  ],
};

const CHEST_TAPS_REQUIRED: Partial<Record<ChestTier, number>> = {
  COMMON: 4,
  RARE: 4,
  EPIC: 3,
};

function uploadsUrl(rel: string): string {
  return `${API_URL}/uploads/${rel}`;
}

export function chestTapFrameUrls(tier: ChestTier): string[] | null {
  const rels = CHEST_TAP_FRAMES[tier];
  if (!rels?.length) return null;
  return rels.map(uploadsUrl);
}

export function chestTapsRequired(tier: ChestTier): number {
  return CHEST_TAPS_REQUIRED[tier] ?? 4;
}

/** Индекс последнего кадра tap-анимации (после него — ещё один клик для награды). */
export function chestLastTapFrameIndex(tier: ChestTier): number {
  const frames = CHEST_TAP_FRAMES[tier];
  return Math.max(0, (frames?.length ?? 1) - 1);
}

export function chestHasTapOpen(tier: ChestTier): boolean {
  return (CHEST_TAP_FRAMES[tier]?.length ?? 0) > 1;
}

export function chestClosedUrl(tier: ChestTier): string | null {
  const frames = chestTapFrameUrls(tier);
  return frames?.[0] ?? null;
}
