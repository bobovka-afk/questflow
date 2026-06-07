import { API_URL } from '@shared/api';

export const ACHIEVEMENT_ICON_LIST_SIZE = 48;
/** Achievement board / popup — large medal */
export const ACHIEVEMENT_ICON_CARD_SIZE = 96;

const ACHIEVEMENT_ICON_BASE = `${API_URL}/uploads/ui/achievments`;

/** DB key → filename when they differ */
const ACHIEVEMENT_ICON_FILE_BY_KEY: Record<string, string> = {
  quests_20: 'quest_20.png',
};

const ACHIEVEMENT_KEYS_WITH_ICONS = new Set([
  'first_card',
  'cards_25',
  'cards_100',
  'streak_7',
  'streak_14',
  'streak_30',
  'level_5',
  'level_10',
  'first_quest',
  'quests_20',
  'dust_100',
  'cosmetics_10',
]);

function achievementIconFile(key: string): string {
  const mapped = ACHIEVEMENT_ICON_FILE_BY_KEY[key];
  if (mapped) return mapped;
  if (ACHIEVEMENT_KEYS_WITH_ICONS.has(key)) return `${key}.png`;
  return 'universal.png';
}

/** Per-key medal; unknown keys → universal.png. Locked state — CSS grayscale on the same file. */
export function achievementIconUrl(key: string): string {
  return `${ACHIEVEMENT_ICON_BASE}/${achievementIconFile(key)}`;
}

export function achievementIconLockedClassName(unlocked: boolean): string {
  return unlocked
    ? 'trello-character-achievement-icon'
    : 'trello-character-achievement-icon trello-character-achievement-icon--locked';
}
