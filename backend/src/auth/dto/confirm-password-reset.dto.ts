import {
	IsNotEmpty,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthValidationMsg } from '../../common/validation/auth-validation.messages';

export class ConfirmPasswordResetDto {
	@ApiProperty({
		example: '4b3bc6b2f0b84d8e91fd0d2cb1ad4e5b',
		description: 'Password reset token',
	})
	@IsString({ message: AuthValidationMsg.token.string })
	@IsNotEmpty({ message: AuthValidationMsg.token.required })
	token: string;

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
