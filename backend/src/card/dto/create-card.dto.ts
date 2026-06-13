import { Type } from 'class-transformer';
import {
  IsDateString,
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
import { CARD_TITLE_MAX_LENGTH, CARD_TITLE_MIN_LENGTH } from '../constants';

export class CreateCardDto {
  @ApiProperty({
    example: 'Implement workspace archive',
    description: 'Card title',
    minLength: CARD_TITLE_MIN_LENGTH,
    maxLength: CARD_TITLE_MAX_LENGTH,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(CARD_TITLE_MIN_LENGTH)
  @MaxLength(CARD_TITLE_MAX_LENGTH)
  title: string;

  @ApiPropertyOptional({
    example: 'Allow owners to archive old workspaces without deleting data.',
    description: 'Card description',
    maxLength: 2000,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string | null;

  @ApiPropertyOptional({
    example: 0,
    description: 'Card position within list',
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
    example: '2026-04-10T12:00:00.000Z',
    description: 'Card due date in ISO format',
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string | null;

  @ApiPropertyOptional({
    example: 7,
    description: 'Assignee user id',
    minimum: 1,
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  assigneeId?: number | null;
}
