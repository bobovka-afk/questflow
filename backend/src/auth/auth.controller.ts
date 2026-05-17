import {
	Body,
	Controller,
	Get,
	Post,
	Query,
	Req,
	UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { HttpCode } from '@nestjs/common';
import { Request, type Response } from 'express';
import type { AuthedRequest } from '../common/type';
import { Res } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ConfirmPasswordResetDto } from './dto/confirm-password-reset.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RateLimit } from '../common/decorators/rate-limit.decorator';
import { RateLimitGuard } from '../common/guards/rate-limit.guard';
import { JwtAuthGuard } from './guards/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type {
  LoginResult,
  RefreshTokensResult,
  RegisterResult,
} from './type';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @HttpCode(200)
  @UseGuards(RateLimitGuard)
  @RateLimit({ key: 'auth:register', limit: 5, windowSec: 300 })
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto, description: 'Registration payload' })
  @ApiResponse({ status: 200, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: "code: 'EMAIL_ALREADY_EXISTS'" })
  @ApiResponse({ status: 429, description: "code: 'RATE_LIMIT_EXCEEDED'" })
  register(@Body() registerDto: RegisterDto): Promise<RegisterResult> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(200)
  @UseGuards(RateLimitGuard)
  @RateLimit({ key: 'auth:login', limit: 5, windowSec: 60 })
  @ApiOperation({ summary: 'Authenticate user with email and password' })
  @ApiBody({ type: LoginDto, description: 'Login credentials payload' })
  @ApiResponse({ status: 200, description: 'User authenticated successfully.' })
  @ApiResponse({ status: 401, description: "code: 'INVALID_CREDENTIALS'" })
  @ApiResponse({ status: 429, description: "code: 'RATE_LIMIT_EXCEEDED'" })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<LoginResult, 'refreshToken'>> {
    const { refreshToken, ...response } = await this.authService.login(loginDto);
    this.authService.addRefreshTokenToResponse(res, refreshToken);
    return response;
  }

 	@HttpCode(200)
	@Post('login/access-token')
	@ApiOperation({ summary: 'Issue new tokens using refresh cookie' })
	@ApiResponse({ status: 200, description: 'New access and refresh tokens issued successfully.' })
	@ApiResponse({ status: 401, description: "code: 'REFRESH_TOKEN_REQUIRED' | code: 'INVALID_REFRESH_TOKEN' | code: 'USER_NOT_FOUND'" })
	async getNewTokens(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	): Promise<Omit<RefreshTokensResult, 'refreshToken'>> {
		const refreshTokenFromCookies = req.cookies[
			this.authService.REFRESH_TOKEN_NAME
		] as string | undefined

		if (!refreshTokenFromCookies) {
			this.authService.removeRefreshTokenFromResponse(res)
			throw new UnauthorizedException({
				code: 'REFRESH_TOKEN_REQUIRED',
				message: 'Refresh token is missing or invalid',
			})
		}

		const { refreshToken, ...response } =
			await this.authService.getNewTokens(refreshTokenFromCookies)
		this.authService.addRefreshTokenToResponse(res, refreshToken)
		return response
	}


	@HttpCode(200)
	@Post('logout')
	@ApiOperation({ summary: 'Clear refresh token cookie' })
	@ApiResponse({ status: 200, description: 'User logged out successfully.' })
	logout(@Res({ passthrough: true }) res: Response): boolean {
		this.authService.removeRefreshTokenFromResponse(res)
		return true
	}

	@Post('email/verification/request')
	@HttpCode(200)
	@UseGuards(RateLimitGuard)
	@RateLimit({ key: 'auth:email-verification', limit: 3, windowSec: 300 })
	@ApiOperation({ summary: 'Send email verification message' })
	@ApiBody({ type: ForgotPasswordDto, description: 'Email verification request payload' })
	@ApiResponse({ status: 200, description: 'Email verification request processed successfully.' })
	requestEmailVerification(
		@Body() dto: ForgotPasswordDto,
	): Promise<{ ok: boolean }> {
		return this.authService.requestEmailVerification(dto.email);
	}

	@Get('email/verification/confirm')
	@ApiOperation({ summary: 'Confirm email verification token' })
	@ApiQuery({
		name: 'token',
		required: true,
		example: '4b3bc6b2f0b84d8e91fd0d2cb1ad4e5b',
		description: 'Email verification token',
	})
	@ApiResponse({ status: 200, description: 'Email verification result returned successfully.' })
	@ApiResponse({ status: 302, description: 'Redirect to the client application with verification result.' })
	async confirmEmailVerification(
		@Query('token') token: string,
		@Res() res: Response,
	): Promise<void> {
		let status = 'invalid';
		try {
			await this.authService.confirmEmailVerification(token);
			status = 'success';
		} catch {
			status = 'invalid';
		}

		const clientUrl = this.configService.get<string>('CLIENT_URL') || '';
		if (clientUrl) {
			res.redirect(`${clientUrl}/email-verified?status=${status}`);
			return;
		}

		res.json({ status });
	}

	@Post('password/reset/request')
	@HttpCode(200)
	@UseGuards(RateLimitGuard)
	@RateLimit({ key: 'auth:password-reset-request', limit: 3, windowSec: 300 })
	@ApiOperation({ summary: 'Send password reset email' })
	@ApiBody({ type: ForgotPasswordDto, description: 'Password reset request payload' })
	@ApiResponse({ status: 200, description: 'Password reset request processed successfully.' })
	requestPasswordReset(
		@Body() dto: ForgotPasswordDto,
	): Promise<{ ok: boolean }> {
		return this.authService.requestPasswordReset(dto.email);
	}

	@Post('password/reset/confirm')
	@HttpCode(200)
	@UseGuards(RateLimitGuard)
	@RateLimit({ key: 'auth:password-reset-confirm', limit: 5, windowSec: 300 })
	@ApiOperation({ summary: 'Confirm password reset token' })
	@ApiBody({ type: ConfirmPasswordResetDto, description: 'Password reset confirmation payload' })
	@ApiResponse({ status: 200, description: 'Password reset completed successfully.' })
	@ApiResponse({ status: 400, description: "code: 'TOKEN_REQUIRED' | code: 'PASSWORD_REQUIRED' | code: 'TOKEN_INVALID_OR_EXPIRED'" })
	@ApiResponse({ status: 429, description: "code: 'RATE_LIMIT_EXCEEDED'" })
	confirmPasswordReset(@Body() dto: ConfirmPasswordResetDto): Promise<{ ok: boolean }> {
		return this.authService.confirmPasswordReset(dto.token, dto.newPassword);
	}

  @Post('password/change')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, RateLimitGuard)
  @RateLimit({ key: 'auth:password-change', limit: 5, windowSec: 300 })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password for authenticated user' })
  @ApiBody({ type: ChangePasswordDto, description: 'Password change payload' })
  @ApiResponse({ status: 200, description: 'Password changed successfully.' })
  @ApiResponse({ status: 400, description: "code: 'NEW_PASSWORD_REQUIRED' | code: 'PASSWORD_SHOULD_DIFFER' | code: 'CURRENT_PASSWORD_REQUIRED'" })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED' | code: 'USER_NOT_FOUND' | code: 'INVALID_CURRENT_PASSWORD'" })
  @ApiResponse({ status: 429, description: "code: 'RATE_LIMIT_EXCEEDED'" })
  changePassword(
    @Req() req: AuthedRequest,
    @Body() dto: ChangePasswordDto,
  ): Promise<{ ok: boolean }> {
    return this.authService.changePassword(
      req.user.id,
      dto.currentPassword,
      dto.newPassword,
    );
  }


  @Get('google')
	@UseGuards(AuthGuard('google'))
	@ApiOperation({ summary: 'Start Google OAuth flow' })
	@ApiResponse({ status: 302, description: 'Redirect to Google OAuth consent screen.' })
	async googleAuth(): Promise<void> {}

	@Get('google/callback')
	@UseGuards(AuthGuard('google'))
	@ApiOperation({ summary: 'Handle Google OAuth callback' })
	@ApiResponse({ status: 302, description: 'Redirect to the client application after Google authentication.' })
	async googleAuthCallback(
		@Req() req: { user: { email: string; name: string; picture: string } },
		@Res({ passthrough: true }) res: Response,
	): Promise<void> {
		const { refreshToken, ...response } =
			await this.authService.validateOAuthLogin(req)
		this.authService.addRefreshTokenToResponse(res, refreshToken)
		const clientUrl = this.configService.get<string>('CLIENT_URL') || ''
		res.redirect(
			`${clientUrl}/dashboard?accessToken=${response.accessToken}`
		)
	}

}