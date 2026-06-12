import { API_URL } from '@shared/api';

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
  manaCurrent?: number;
  dust: number;
  checkinStreak: number;
  lastCheckinDayKey?: string | null;
  equippedPortraitFrameKey?: string | null;
  equippedProfileBackgroundKey?: string | null;
  equippedTitleBadgeKey?: string | null;
  friendCode?: number;
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

const AVATAR_PRESET_UPLOAD_OVERRIDES: Record<string, string> = {
  DRUID_MAN: 'character-avatars/clear_man/druid_man.png',
  DRUID_WOMAN: 'character-avatars/clear_girl/druid_girl.png',
  HUNTER_MAN: 'character-avatars/clear_man/hunter_man.png',
  HUNTER_WOMAN: 'character-avatars/clear_girl/hunter_girl.png',
  MAGE_MAN: 'character-avatars/clear_man/mage_man.png',
  MAGE_WOMAN: 'character-avatars/clear_girl/mage_girl.png',
  PALADIN_MAN: 'character-avatars/clear_man/paladin_man.png',
  PALADIN_WOMAN: 'character-avatars/clear_girl/paladin_girl.png',
  ROGUE_MAN: 'character-avatars/clear_man/rogue_man.png',
  ROGUE_WOMAN: 'character-avatars/clear_girl/rogue_girl.png',
  WARRIOR_MAN: 'character-avatars/clear_man/warrior_man.png',
  WARRIOR_WOMAN: 'character-avatars/clear_girl/warrior_girl.png',
};

/** Static portrait under /uploads/character-avatars/… */
export function characterPortraitUrl(avatarPreset: string): string {
  const uploadOverride = AVATAR_PRESET_UPLOAD_OVERRIDES[avatarPreset];
  if (uploadOverride) {
    return `${API_URL}/uploads/${uploadOverride}`;
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
    route.startsWith('/personal') ||
    route.startsWith('/profile') ||
    route.startsWith('/invites') ||
    route.startsWith('/dashboard')
  );
}
