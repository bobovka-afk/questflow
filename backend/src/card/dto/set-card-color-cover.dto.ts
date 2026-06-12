import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CardCoverDisplayMode, ListColorPreset } from '../../generated/prisma/enums';

export class SetCardColorCoverDto {
  @ApiPropertyOptional({
    enum: ListColorPreset,
    nullable: true,
    description: 'Cover color preset; null clears color cover',
  })
  @IsOptional()
  @IsEnum(ListColorPreset)
  colorPreset?: ListColorPreset | null;

  @ApiPropertyOptional({
    enum: CardCoverDisplayMode,
    description: 'BANNER = header strip, FULL = entire card background',
  })
  @IsOptional()
  @IsEnum(CardCoverDisplayMode)
  displayMode?: CardCoverDisplayMode;
}
