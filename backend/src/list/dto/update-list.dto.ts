import { IsBoolean, IsOptional, IsString, MaxLength, MinLength, IsEnum } from 'class-validator';
import { ListColorPreset } from '../../generated/prisma/enums';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { LIST_NAME_MAX_LENGTH, LIST_NAME_MIN_LENGTH } from '../constants';

export class UpdateListDto {
  @ApiPropertyOptional({
    example: 'Done',
    description: 'Updated list name',
    minLength: LIST_NAME_MIN_LENGTH,
    maxLength: LIST_NAME_MAX_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MinLength(LIST_NAME_MIN_LENGTH)
  @MaxLength(LIST_NAME_MAX_LENGTH)
  name?: string;

  @ApiPropertyOptional({
    enum: ListColorPreset,
    example: ListColorPreset.GREEN,
    description: 'Color preset for the list',
  })
  @IsOptional()
  @IsEnum(ListColorPreset)
  colorPreset?: ListColorPreset;

  @ApiPropertyOptional({ description: 'true = archive, false = restore' })
  @IsOptional()
  @IsBoolean()
  archived?: boolean;
}
