import {
  CharacterAvatarPreset,
  GenderCharacter,
} from '../../generated/prisma/enums';

export const QUEST_AVATAR_PRESETS: ReadonlySet<CharacterAvatarPreset> = new Set([
  CharacterAvatarPreset.QUEST_MAGE_MAN,
  CharacterAvatarPreset.QUEST_MAGE_WOMAN,
]);

export function isQuestAvatarPreset(
  preset: CharacterAvatarPreset,
): boolean {
  return QUEST_AVATAR_PRESETS.has(preset);
}

export function genderForAvatarPreset(
  preset: CharacterAvatarPreset,
): GenderCharacter {
  if (preset === CharacterAvatarPreset.QUEST_MAGE_WOMAN) {
    return GenderCharacter.FEMALE;
  }
  if (preset.endsWith('_WOMAN')) {
    return GenderCharacter.FEMALE;
  }
  return GenderCharacter.MALE;
}
