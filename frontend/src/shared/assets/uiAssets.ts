import { API_URL } from '@shared/api';

export const XP_TOAST_ICON_SIZE = 32;
export const CHECKIN_TOAST_ICON_SIZE = 32;
export const INTRO_ILLUSTRATION_WIDTH = 800;
export const INTRO_ILLUSTRATION_HEIGHT = 450;
export const STAT_ICON_SIZE = 32;

function uiAsset(path: string): string {
  return `${API_URL}/uploads/ui/${path}`;
}

export function xpToastIconUrl(): string {
  return uiAsset('xp/xp.png');
}

export function checkinToastIconUrl(): string {
  return uiAsset('check/check.png');
}

export function gamificationIntroIllustrationUrl(): string {
  return uiAsset('intro/intro.png');
}

export function levelStatIconUrl(): string {
  return uiAsset('level/level.png');
}

export function healthStatIconUrl(): string {
  return uiAsset('health/health.png');
}

export function manaStatIconUrl(): string {
  return uiAsset('mana/mana.png');
}

export function appLogoUrl(): string {
  return uiAsset('logo/logo.png');
}
