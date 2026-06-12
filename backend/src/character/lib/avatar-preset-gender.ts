import {
  CharacterAvatarPreset,
  GenderCharacter,
} from '../../generated/prisma/enums';

export function genderForAvatarPreset(
  preset: CharacterAvatarPreset,
): GenderCharacter {
  return preset.endsWith('_WOMAN')
    ? GenderCharacter.FEMALE
    : GenderCharacter.MALE;
}

export function isQuestAvatarPresetKey(preset: CharacterAvatarPreset): boolean {
  return preset.startsWith('QUEST_');
}
