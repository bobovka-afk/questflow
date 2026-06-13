import { Type } from 'class-transformer';
import {
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
import { LIST_NAME_MAX_LENGTH, LIST_NAME_MIN_LENGTH } from '../constants';

export class CreateListDto {
  @ApiProperty({
    example: 'In Progress',
    description: 'List name',
    minLength: LIST_NAME_MIN_LENGTH,
    maxLength: LIST_NAME_MAX_LENGTH,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(LIST_NAME_MIN_LENGTH)
  @MaxLength(LIST_NAME_MAX_LENGTH)
  name: string;

  @ApiPropertyOptional({
    example: 0,
    description: 'List position within board',
    minimum: 0,
    maximum: 100000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100000)
  position?: number;
}
