import { IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CharacterAvatarPreset, GenderCharacter } from '../../generated/prisma/enums';

export class CreateCharacterDto {
  @ApiProperty({
    example: 'Board Guardian',
    description: 'Character name',
    minLength: 3,
    maxLength: 40,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(40)
  name: string;

  @ApiProperty({
    enum: GenderCharacter,
    example: GenderCharacter.MALE,
    description: 'Character gender',
  })
  @IsEnum(GenderCharacter)
  gender: GenderCharacter;

  @ApiProperty({
    enum: CharacterAvatarPreset,
    example: CharacterAvatarPreset.DRUID_MAN,
    description:
      'Portrait preset; must match gender',
  })
  @IsEnum(CharacterAvatarPreset)
  avatarPreset: CharacterAvatarPreset;
}
