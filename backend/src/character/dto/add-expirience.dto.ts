import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class AddExperienceDto {
  @ApiProperty({
    example: 120,
    description: 'Experience points to grant (integer)',
    minimum: 1,
    maximum: 1000,
  })
  @IsInt()
  @Min(1)
  @Max(1000)
  amount: number;
}
