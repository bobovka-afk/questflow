import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateDisplayTimezoneDto {
  @ApiProperty({ example: 'Europe/Moscow' })
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  displayTimezone!: string;
}
