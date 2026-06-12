import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CARD_TITLE_MAX_LENGTH } from '../constants';

export class UpdateCardDto {
  @ApiPropertyOptional({
    example: 'Implement workspace archive',
    description: 'Updated card title',
    minLength: 3,
    maxLength: CARD_TITLE_MAX_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(CARD_TITLE_MAX_LENGTH)
  title?: string;

  @ApiPropertyOptional({
    example: 'Updated card description',
    description: 'Updated card description',
    maxLength: 2000,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string | null;

  @ApiPropertyOptional({
    example: 2,
    description: 'Updated card position within list',
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
    description: 'Updated card due date in ISO format',
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string | null;

  @ApiPropertyOptional({
    example: 7,
    description: 'Updated assignee user id',
    minimum: 1,
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  assigneeId?: number | null;

  @ApiPropertyOptional({
    example: 1440,
    description: 'Minutes before dueDate to send in-app reminder; null = off',
    nullable: true,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  reminderMinutesBefore?: number | null;
}
