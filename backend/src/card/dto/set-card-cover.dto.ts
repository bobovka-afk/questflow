import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class SetCardCoverDto {
  @ApiProperty({ required: false, nullable: true, example: 12 })
  @IsOptional()
  @IsInt()
  @Min(1)
  attachmentId?: number | null;
}
