import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotificationSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  emailSecurity?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  emailWorkspaceInvites?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  inAppGamification?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  inAppMentions?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  inAppDeadlines?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  inAppAssign?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  inAppSocial?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  pushAssign?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  pushMention?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  pushFriendRequest?: boolean;
}
