import { API_URL } from '@shared/api';
import {
  PORTRAIT_FRAME_AXIS_OVERRIDES,
  PORTRAIT_FRAME_FIT_REF,
  PORTRAIT_FRAME_INSET_SCALE_DEFAULT,
  PORTRAIT_FRAME_INSET_SCALE_OVERRIDES,
} from './portraitLayout';

/**
 * Cosmetic key → path under backend/uploads/.
 */
const COSMETIC_UPLOAD_PATH: Record<string, string> = {
  frame_bronze: 'cosmetics/portraits/bronze.png',
  frame_silver: 'cosmetics/portraits/silver.png',
  frame_gold: 'cosmetics/portraits/gold.png',
  frame_mystic: 'cosmetics/portraits/mystic.png',
  frame_epic_flame: 'cosmetics/portraits/mystic.png',
  bg_meadow: 'cosmetics/backgrounds/magical_fantasy.png',
  bg_night: 'cosmetics/backgrounds/dark_castle.png',
  bg_woods: 'cosmetics/backgrounds/woods.png',
  bg_lake_forest: 'cosmetics/backgrounds/lake_forest.png',
};

const PORTRAIT_FRAME_KEYS = new Set([
  'frame_bronze',
  'frame_silver',
  'frame_gold',
  'frame_mystic',
  'frame_epic_flame',
]);

export {
  PORTRAIT_FRAME_FIT_REF,
  PORTRAIT_FRAME_INSET_SCALE_DEFAULT,
  PORTRAIT_FRAME_INSET_SCALE_OVERRIDES,
} from './portraitLayout';

export function cosmeticAssetUrl(key: string | null | undefined): string | null {
  if (!key) return null;
  const rel = COSMETIC_UPLOAD_PATH[key];
  if (!rel) return null;
  return `${API_URL}/uploads/${rel}`;
}

export function portraitFrameUrl(frameKey: string | null | undefined): string | null {
  return cosmeticAssetUrl(frameKey);
}

/** CSS-переменные для слоя рамки; style на .trello-character-profile-portrait-stack--framed */
export function portraitFrameFitVars(
  frameKey: string | null | undefined,
): Record<string, string> | undefined {
  if (!frameKey || !PORTRAIT_FRAME_KEYS.has(frameKey)) return undefined;
  const box = PORTRAIT_FRAME_FIT_REF;
  const bw = box.x1 - box.x0 + 1;
  const bh = box.y1 - box.y0 + 1;
  const inset =
    PORTRAIT_FRAME_INSET_SCALE_OVERRIDES[frameKey] ??
    PORTRAIT_FRAME_INSET_SCALE_DEFAULT;
  const axis = PORTRAIT_FRAME_AXIS_OVERRIDES[frameKey];
  const scaleX = axis?.scaleX ?? inset;
  const scaleY = axis?.scaleY ?? inset;
  const translateY = axis?.translateY ?? 0;

  return {
    '--portrait-frame-w': `${(box.canvas / bw) * 100}%`,
    '--portrait-frame-h': `${(box.canvas / bh) * 100}%`,
    '--portrait-frame-left': `${(-box.x0 / bw) * 100}%`,
    '--portrait-frame-top': `${(-box.y0 / bh) * 100}%`,
    '--portrait-frame-inset-scale': String(inset),
    '--portrait-frame-scale-x': String(scaleX),
    '--portrait-frame-scale-y': String(scaleY),
    '--portrait-frame-translate-y': `${translateY}%`,
  };
}
