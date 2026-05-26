import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AuthValidationMsg } from '../../common/validation/auth-validation.messages';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail({}, { message: AuthValidationMsg.email.invalid })
  @IsNotEmpty({ message: AuthValidationMsg.email.required })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  email: string;

  @ApiProperty({
    example: 'qwerty123',
    description: 'User password',
    minLength: 6,
    maxLength: 72,
  })
  @IsString({ message: AuthValidationMsg.password.string })
  @IsNotEmpty({ message: AuthValidationMsg.password.required })
  @MinLength(6, { message: AuthValidationMsg.password.min })
  @MaxLength(72, { message: AuthValidationMsg.password.max })
  password: string;
}
