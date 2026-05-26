import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ChestTier } from '../../generated/prisma/enums';

export class PurchaseDustChestDto {
  @ApiProperty({ enum: ChestTier, example: ChestTier.COMMON })
  @IsEnum(ChestTier)
  tier: ChestTier;
}
