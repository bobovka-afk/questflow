import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import type { AuthTokens } from './interface';
import type { LoginResult, OAuthLoginResult, RefreshTokensResult, RegisterResult } from './type';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    private readonly configService;
    private readonly prisma;
    private readonly mailService;
    private readonly EXPIRE_DAY_REFRESH_TOKEN;
    readonly REFRESH_TOKEN_NAME = "refreshToken";
    constructor(userService: UserService, jwtService: JwtService, configService: ConfigService, prisma: PrismaService, mailService: MailService);
    register(registerDto: RegisterDto): Promise<RegisterResult>;
    login(loginDto: LoginDto): Promise<LoginResult>;
    getNewTokens(refreshToken: string): Promise<RefreshTokensResult>;
    issueTokens(userId: number): AuthTokens;
    validateOAuthLogin(req: {
        user: {
            email: string;
            name: string;
            picture: string;
        };
    }): Promise<OAuthLoginResult>;
    addRefreshTokenToResponse(res: Response, refreshToken: string): void;
    removeRefreshTokenFromResponse(res: Response): void;
    requestEmailVerification(email: string): Promise<{
        ok: boolean;
    }>;
    confirmEmailVerification(token: string): Promise<{
        ok: boolean;
    }>;
    requestPasswordReset(email: string): Promise<{
        ok: boolean;
    }>;
    confirmPasswordReset(token: string, newPassword: string): Promise<{
        ok: boolean;
    }>;
    changePassword(userId: number, currentPassword: string | undefined, newPassword: string): Promise<{
        ok: boolean;
    }>;
    private signIn;
    private validateUser;
    private normalizeEmail;
    private throwInvalidCredentials;
    private generateToken;
    private hashToken;
    private getEmailVerificationTtlMs;
    private getPasswordResetTtlMs;
}
