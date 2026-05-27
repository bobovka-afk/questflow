import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UnequipCosmeticDto {
  @ApiProperty({ example: 1, description: 'Inventory item id' })
  @IsInt()
  @Min(1)
  inventoryItemId: number;
}
