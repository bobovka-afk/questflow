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
}
