import { CharacterAvatarPreset, GenderCharacter } from '../../generated/prisma/enums';
export declare class CreateCharacterDto {
    name: string;
    gender: GenderCharacter;
    avatarPreset: CharacterAvatarPreset;
}
