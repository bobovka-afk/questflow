import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsInt, IsString, Max, Min } from 'class-validator';

export class CreatePartyRaidDto {
  @ApiProperty({ example: 'nasadka' })
  @IsString()
  bossKey!: string;

  @ApiProperty({ type: [Number], example: [2, 3] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @IsInt({ each: true })
  @Min(1, { each: true })
  friendUserIds!: number[];
}
