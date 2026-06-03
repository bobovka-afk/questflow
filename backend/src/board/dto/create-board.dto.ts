import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BOARD_TEMPLATE_KEYS } from '../lib/board-templates';

export class CreateBoardDto {
  @ApiProperty({
    example: 'Sprint backlog',
    description: 'Board name',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiPropertyOptional({
    example: 'Board for planning the current sprint',
    description: 'Board description',
    minLength: 3,
    maxLength: 255,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  description?: string | null;

  @ApiPropertyOptional({
    example: 0,
    description: 'Board position within workspace',
    minimum: 0,
    maximum: 100000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100000)
  position?: number;

  @ApiPropertyOptional({
    example: 'kanban-dev',
    description: 'Board template: empty | kanban-dev | backlog',
    enum: BOARD_TEMPLATE_KEYS,
  })
  @IsOptional()
  @IsString()
  @IsIn(BOARD_TEMPLATE_KEYS)
  template?: (typeof BOARD_TEMPLATE_KEYS)[number];
}
