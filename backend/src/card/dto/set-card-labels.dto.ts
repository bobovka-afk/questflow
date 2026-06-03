import { ArrayMaxSize, IsArray, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetCardLabelsDto {
  @ApiProperty({ example: [1, 2], description: 'Workspace label ids (max 6)' })
  @IsArray()
  @ArrayMaxSize(6)
  @IsInt({ each: true })
  labelIds!: number[];
}
