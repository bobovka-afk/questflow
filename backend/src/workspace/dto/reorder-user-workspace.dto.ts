import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class ReorderUserWorkspaceDto {
  @ApiProperty({
    description: 'WorkspaceMember id for the current user',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  memberId: number;

  @ApiProperty({
    description: 'New index among all user workspaces (0-based)',
    example: 0,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  position: number;
}
