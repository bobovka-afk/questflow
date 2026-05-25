import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request, type Response } from 'express';
import type { AuthedRequest } from '../common/type';
import { ConfigService } from '@nestjs/config';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ConfirmPasswordResetDto } from './dto/confirm-password-reset.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import type { LoginResult, RefreshTokensResult, RegisterResult } from './type';
export declare class AuthController {
    private readonly authService;
    private readonly configService;
    constructor(authService: AuthService, configService: ConfigService);
    register(registerDto: RegisterDto): Promise<RegisterResult>;
    login(loginDto: LoginDto, res: Response): Promise<Omit<LoginResult, 'refreshToken'>>;
    getNewTokens(req: Request, res: Response): Promise<Omit<RefreshTokensResult, 'refreshToken'>>;
    logout(res: Response): boolean;
    requestEmailVerification(dto: ForgotPasswordDto): Promise<{
        ok: boolean;
    }>;
    confirmEmailVerification(token: string, res: Response): Promise<void>;
    requestPasswordReset(dto: ForgotPasswordDto): Promise<{
        ok: boolean;
    }>;
    confirmPasswordReset(dto: ConfirmPasswordResetDto): Promise<{
        ok: boolean;
    }>;
    changePassword(req: AuthedRequest, dto: ChangePasswordDto): Promise<{
        ok: boolean;
    }>;
    googleAuth(): Promise<void>;
    googleAuthCallback(req: {
        user: {
            email: string;
            name: string;
            picture: string;
        };
    }, res: Response): Promise<void>;
}
