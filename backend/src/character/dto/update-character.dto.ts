import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CharacterAvatarPreset, GenderCharacter } from '../../generated/prisma/enums';

export class UpdateCharacterDto {
  @ApiPropertyOptional({
    example: 'Board Guardian',
    description: 'Character name',
    minLength: 3,
    maxLength: 40,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(40)
  name?: string;

  @ApiPropertyOptional({
    enum: GenderCharacter,
    example: GenderCharacter.FEMALE,
    description: 'Character gender',
  })
  @IsOptional()
  @IsEnum(GenderCharacter)
  gender?: GenderCharacter;

  @ApiPropertyOptional({
    enum: CharacterAvatarPreset,
    example: CharacterAvatarPreset.MAGE_WOMAN,
    description:
      'Portrait preset; must match character gender',
  })
  @IsOptional()
  @IsEnum(CharacterAvatarPreset)
  avatarPreset?: CharacterAvatarPreset;
}
