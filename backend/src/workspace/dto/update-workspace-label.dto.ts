import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ListColorPreset } from '../../generated/prisma/enums';

export class UpdateWorkspaceLabelDto {
  @ApiPropertyOptional({ minLength: 1, maxLength: 24 })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(24)
  name?: string;

  @ApiPropertyOptional({ enum: ListColorPreset })
  @IsOptional()
  @IsEnum(ListColorPreset)
  colorPreset?: ListColorPreset;
}
