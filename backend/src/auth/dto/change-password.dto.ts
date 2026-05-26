import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { AuthValidationMsg } from '../../common/validation/auth-validation.messages';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'oldPassword123',
    description: 'Current user password (required when password already exists)',
    required: false,
    minLength: 6,
    maxLength: 72,
  })
  @IsOptional()
  @IsString({ message: AuthValidationMsg.currentPassword.string })
  @MinLength(6, { message: AuthValidationMsg.currentPassword.min })
  @MaxLength(72, { message: AuthValidationMsg.currentPassword.max })
  currentPassword?: string;

  @ApiProperty({
    example: 'newStrongPassword123',
    description: 'New user password',
    minLength: 6,
    maxLength: 72,
  })
  @IsString({ message: AuthValidationMsg.newPassword.string })
  @IsNotEmpty({ message: AuthValidationMsg.newPassword.required })
  @MinLength(6, { message: AuthValidationMsg.newPassword.min })
  @MaxLength(72, { message: AuthValidationMsg.newPassword.max })
  newPassword: string;
}
