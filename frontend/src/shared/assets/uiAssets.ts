import { API_URL } from '@shared/api';

export const XP_TOAST_ICON_SIZE = 32;
export const CHECKIN_TOAST_ICON_SIZE = 32;
export const INTRO_ILLUSTRATION_WIDTH = 800;
export const INTRO_ILLUSTRATION_HEIGHT = 450;

export function xpToastIconUrl(): string {
  return `${API_URL}/uploads/ui/xp/xp.png`;
}

export function checkinToastIconUrl(): string {
  return `${API_URL}/uploads/ui/checkin/check.png`;
}

export function gamificationIntroIllustrationUrl(): string {
  return `${API_URL}/uploads/ui/intro/intro.png`;
}
