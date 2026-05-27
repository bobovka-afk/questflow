import { API_URL } from './api';

export type GenderCharacter = 'MALE' | 'FEMALE';

export type CharacterDto = {
  id: number;
  userId: number;
  name: string;
  gender: GenderCharacter;
  avatarPreset: string;
  currentXp: number;
  level: number;
  health: number;
  dust: number;
  checkinStreak: number;
  lastCheckinDayKey?: string | null;
  equippedPortraitFrameKey?: string | null;
  equippedProfileBackgroundKey?: string | null;
  equippedTitleBadgeKey?: string | null;
  createdAt: string;
  updatedAt: string;
};

/** Archetype keys shared with uploads/character-avatars/Male|Female/{role}-man|woman.png */
export const CHARACTER_ROLES = [
  'DRUID',
  'HUNTER',
  'MAGE',
  'PALADIN',
  'ROGUE',
  'WARRIOR',
] as const;

export type CharacterRole = (typeof CHARACTER_ROLES)[number];

export const ROLE_LABEL_RU: Record<CharacterRole, string> = {
  DRUID: 'Друид',
  HUNTER: 'Охотник',
  MAGE: 'Маг',
  PALADIN: 'Паладин',
  ROGUE: 'Разбойник',
  WARRIOR: 'Воин',
};

export function presetForRole(
  gender: GenderCharacter,
  role: CharacterRole,
): string {
  return gender === 'MALE' ? `${role}_MAN` : `${role}_WOMAN`;
}

const QUEST_AVATAR_PORTRAIT_FILES: Record<string, string> = {
  QUEST_MAGE_MAN: 'quest_mage_man.png',
  QUEST_MAGE_WOMAN: 'quest_mage_woman.png',
};

/** Тест прозрачного фона (PROFILE_BACKGROUND); preset → путь под uploads/ */
const AVATAR_PRESET_UPLOAD_OVERRIDES: Record<string, string> = {
  DRUID_MAN: 'character-avatars/clear/druid_man.png',
};

export function isQuestAvatarPreset(preset: string): boolean {
  return preset in QUEST_AVATAR_PORTRAIT_FILES;
}

/** Static portrait under /uploads/character-avatars/… or quest cosmetics. */
export function characterPortraitUrl(avatarPreset: string): string {
  const uploadOverride = AVATAR_PRESET_UPLOAD_OVERRIDES[avatarPreset];
  if (uploadOverride) {
    return `${API_URL}/uploads/${uploadOverride}`;
  }
  const questFile = QUEST_AVATAR_PORTRAIT_FILES[avatarPreset];
  if (questFile) {
    return `${API_URL}/uploads/cosmetics/portraits/${questFile}`;
  }
  const role = avatarPreset.replace(/_MAN$|_WOMAN$/i, '').toLowerCase();
  if (avatarPreset.endsWith('_MAN')) {
    return `${API_URL}/uploads/character-avatars/Male/${role}-man.png`;
  }
  return `${API_URL}/uploads/character-avatars/Female/${role}-woman.png`;
}

export function routeNeedsCharacterGate(route: string): boolean {
  if (route.startsWith('/character/setup')) return false;
  return (
    route === '/workspaces' ||
    route.startsWith('/workspaces/') ||
    route.startsWith('/profile') ||
    route.startsWith('/invites') ||
    route.startsWith('/dashboard')
  );
}
