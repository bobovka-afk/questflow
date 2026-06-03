import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class DeleteAccountDto {
  @ApiPropertyOptional({ description: 'Required when account has a password' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(72)
  password?: string;

  @ApiPropertyOptional({
    description: 'Type УДАЛИТЬ to confirm when account has no password',
    example: 'УДАЛИТЬ',
  })
  @IsOptional()
  @IsString()
  confirmPhrase?: string;
}
