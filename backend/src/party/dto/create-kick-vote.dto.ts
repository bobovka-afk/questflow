import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CreateKickVoteDto {
  @ApiProperty({ example: 3 })
  @IsInt()
  @Min(1)
  targetUserId!: number;
}
