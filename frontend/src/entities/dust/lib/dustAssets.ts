import { API_URL } from '@shared/api';

const DUST_ICON_PATH = 'ui/dust/dust.png';

export function dustIconUrl(): string {
  return `${API_URL}/uploads/${DUST_ICON_PATH}`;
}

/** Размеры из gamification-assets.md: 24 inline, 48 в модалке дубликата */
export const DUST_ICON_SIZE_SM = 24;
export const DUST_ICON_SIZE_MD = 48;
/** Кнопка «Купить» в магазине сундуков — рядом с ценой */
export const DUST_ICON_SIZE_SHOP = 32;
