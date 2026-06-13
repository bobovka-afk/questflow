import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ListColorPreset } from '../../generated/prisma/enums';

export class CreateWorkspaceLabelDto {
  @ApiProperty({ example: 'Bug', minLength: 1, maxLength: 24 })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(24)
  name!: string;

  @ApiPropertyOptional({ enum: ListColorPreset })
  @IsOptional()
  @IsEnum(ListColorPreset)
  colorPreset?: ListColorPreset;
}
