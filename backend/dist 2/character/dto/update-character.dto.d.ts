import { CharacterAvatarPreset, GenderCharacter } from '../../generated/prisma/enums';
export declare class UpdateCharacterDto {
    name?: string;
    gender?: GenderCharacter;
    avatarPreset?: CharacterAvatarPreset;
}
