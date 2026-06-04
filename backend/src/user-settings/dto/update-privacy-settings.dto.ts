import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePrivacySettingsDto {
  @ApiPropertyOptional({ description: 'Allow others to open your character profile' })
  @IsOptional()
  @IsBoolean()
  allowCharacterView?: boolean;

  @ApiPropertyOptional({ description: 'Show account avatar on public profile page' })
  @IsOptional()
  @IsBoolean()
  showAccountAvatarOnPublicProfile?: boolean;

  @ApiPropertyOptional({ description: 'Allow finding this user by character name' })
  @IsOptional()
  @IsBoolean()
  allowFindByCharacterName?: boolean;

  @ApiPropertyOptional({ description: 'Show online / last seen to friends' })
  @IsOptional()
  @IsBoolean()
  showOnlineStatusToFriends?: boolean;
}
