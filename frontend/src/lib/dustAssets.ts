import { API_URL } from './api';

const DUST_ICON_PATH = 'dust/dust.png';

export function dustIconUrl(): string {
  return `${API_URL}/uploads/${DUST_ICON_PATH}`;
}

/** Размеры из gamification-assets.md: 24 inline, 48 в модалке дубликата */
export const DUST_ICON_SIZE_SM = 24;
export const DUST_ICON_SIZE_MD = 48;
