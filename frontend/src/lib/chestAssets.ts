import { API_URL } from './api';
import type { ChestTier } from './quests';

/** Отдельные PNG на каждый шаг tap-to-open (вариант B). */
const CHEST_TAP_FRAMES: Partial<Record<ChestTier, string[]>> = {
  COMMON: [
    'chests/common/0.png',
    'chests/common/1.png',
    'chests/common/2.png',
    'chests/common/3.png',
    'chests/common/4.png',
  ],
};

const CHEST_TAPS_REQUIRED: Partial<Record<ChestTier, number>> = {
  COMMON: 4,
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

export function chestHasTapOpen(tier: ChestTier): boolean {
  return (CHEST_TAP_FRAMES[tier]?.length ?? 0) > 1;
}

export function chestClosedUrl(tier: ChestTier): string | null {
  const frames = chestTapFrameUrls(tier);
  return frames?.[0] ?? null;
}
