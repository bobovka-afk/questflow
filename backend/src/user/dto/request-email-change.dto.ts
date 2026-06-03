import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RequestEmailChangeDto {
  @ApiProperty({ example: 'new@example.com' })
  @IsEmail()
  newEmail!: string;

  @ApiPropertyOptional({ description: 'Required when account has a password' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(72)
  currentPassword?: string;
}
