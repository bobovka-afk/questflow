import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EquipCosmeticDto {
  @ApiProperty({ example: 1, description: 'Inventory item id' })
  @IsInt()
  @Min(1)
  inventoryItemId: number;
}
