import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMemberPermissionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  inviteMembers?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  manageBoards?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  archiveBoards?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  manageLabels?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  manageMembers?: boolean;
}
