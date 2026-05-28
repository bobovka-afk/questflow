import { API_URL } from '@shared/api';

/**
 * Временный набор из двух тестовых иконок:
 * unlocked -> color.png, locked -> black.png.
 */
export function achievementIconUrl(unlocked: boolean): string {
  const file = unlocked ? 'color.png' : 'black.png';
  return `${API_URL}/uploads/achievments/${file}`;
}

export const ACHIEVEMENT_ICON_LIST_SIZE = 48;
