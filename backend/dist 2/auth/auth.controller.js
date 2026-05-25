"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const register_dto_1 = require("./dto/register.dto");
const login_dto_1 = require("./dto/login.dto");
const common_2 = require("@nestjs/common");
const common_3 = require("@nestjs/common");
const common_4 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const confirm_password_reset_dto_1 = require("./dto/confirm-password-reset.dto");
const change_password_dto_1 = require("./dto/change-password.dto");
const rate_limit_decorator_1 = require("../common/decorators/rate-limit.decorator");
const rate_limit_guard_1 = require("../common/guards/rate-limit.guard");
const auth_guard_1 = require("./guards/auth.guard");
const swagger_1 = require("@nestjs/swagger");
let AuthController = class AuthController {
    authService;
    configService;
    constructor(authService, configService) {
        this.authService = authService;
        this.configService = configService;
    }
    register(registerDto) {
        return this.authService.register(registerDto);
    }
    async login(loginDto, res) {
        const { refreshToken, ...response } = await this.authService.login(loginDto);
        this.authService.addRefreshTokenToResponse(res, refreshToken);
        return response;
    }
    async getNewTokens(req, res) {
        const refreshTokenFromCookies = req.cookies[this.authService.REFRESH_TOKEN_NAME];
        if (!refreshTokenFromCookies) {
            this.authService.removeRefreshTokenFromResponse(res);
            throw new common_4.UnauthorizedException({
                code: 'REFRESH_TOKEN_REQUIRED',
                message: 'Refresh token is missing or invalid',
            });
        }
        const { refreshToken, ...response } = await this.authService.getNewTokens(refreshTokenFromCookies);
        this.authService.addRefreshTokenToResponse(res, refreshToken);
        return response;
    }
    logout(res) {
        this.authService.removeRefreshTokenFromResponse(res);
        return true;
    }
    requestEmailVerification(dto) {
        return this.authService.requestEmailVerification(dto.email);
    }
    async confirmEmailVerification(token, res) {
        let status = 'invalid';
        try {
            await this.authService.confirmEmailVerification(token);
            status = 'success';
        }
        catch {
            status = 'invalid';
        }
        const clientUrl = this.configService.get('CLIENT_URL') || '';
        if (clientUrl) {
            res.redirect(`${clientUrl}/email-verified?status=${status}`);
            return;
        }
        res.json({ status });
    }
    requestPasswordReset(dto) {
        return this.authService.requestPasswordReset(dto.email);
    }
    confirmPasswordReset(dto) {
        return this.authService.confirmPasswordReset(dto.token, dto.newPassword);
    }
    changePassword(req, dto) {
        return this.authService.changePassword(req.user.id, dto.currentPassword, dto.newPassword);
    }
    async googleAuth() { }
    async googleAuthCallback(req, res) {
        const { refreshToken, ...response } = await this.authService.validateOAuthLogin(req);
        this.authService.addRefreshTokenToResponse(res, refreshToken);
        const clientUrl = this.configService.get('CLIENT_URL') || '';
        res.redirect(`${clientUrl}/dashboard?accessToken=${response.accessToken}`);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, common_2.HttpCode)(200),
    (0, common_1.UseGuards)(rate_limit_guard_1.RateLimitGuard),
    (0, rate_limit_decorator_1.RateLimit)({ key: 'auth:register', limit: 5, windowSec: 300 }),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    (0, swagger_1.ApiBody)({ type: register_dto_1.RegisterDto, description: 'Registration payload' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User registered successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "code: 'EMAIL_ALREADY_EXISTS'" }),
    (0, swagger_1.ApiResponse)({ status: 429, description: "code: 'RATE_LIMIT_EXCEEDED'" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_2.HttpCode)(200),
    (0, common_1.UseGuards)(rate_limit_guard_1.RateLimitGuard),
    (0, rate_limit_decorator_1.RateLimit)({ key: 'auth:login', limit: 5, windowSec: 60 }),
    (0, swagger_1.ApiOperation)({ summary: 'Authenticate user with email and password' }),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto, description: 'Login credentials payload' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User authenticated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'INVALID_CREDENTIALS'" }),
    (0, swagger_1.ApiResponse)({ status: 429, description: "code: 'RATE_LIMIT_EXCEEDED'" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_3.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_2.HttpCode)(200),
    (0, common_1.Post)('login/access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Issue new tokens using refresh cookie' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'New access and refresh tokens issued successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'REFRESH_TOKEN_REQUIRED' | code: 'INVALID_REFRESH_TOKEN' | code: 'USER_NOT_FOUND'" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_3.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getNewTokens", null);
__decorate([
    (0, common_2.HttpCode)(200),
    (0, common_1.Post)('logout'),
    (0, swagger_1.ApiOperation)({ summary: 'Clear refresh token cookie' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User logged out successfully.' }),
    __param(0, (0, common_3.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Boolean)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('email/verification/request'),
    (0, common_2.HttpCode)(200),
    (0, common_1.UseGuards)(rate_limit_guard_1.RateLimitGuard),
    (0, rate_limit_decorator_1.RateLimit)({ key: 'auth:email-verification', limit: 3, windowSec: 300 }),
    (0, swagger_1.ApiOperation)({ summary: 'Send email verification message' }),
    (0, swagger_1.ApiBody)({ type: forgot_password_dto_1.ForgotPasswordDto, description: 'Email verification request payload' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Email verification request processed successfully.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "requestEmailVerification", null);
__decorate([
    (0, common_1.Get)('email/verification/confirm'),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm email verification token' }),
    (0, swagger_1.ApiQuery)({
        name: 'token',
        required: true,
        example: '4b3bc6b2f0b84d8e91fd0d2cb1ad4e5b',
        description: 'Email verification token',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Email verification result returned successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 302, description: 'Redirect to the client application with verification result.' }),
    __param(0, (0, common_1.Query)('token')),
    __param(1, (0, common_3.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "confirmEmailVerification", null);
__decorate([
    (0, common_1.Post)('password/reset/request'),
    (0, common_2.HttpCode)(200),
    (0, common_1.UseGuards)(rate_limit_guard_1.RateLimitGuard),
    (0, rate_limit_decorator_1.RateLimit)({ key: 'auth:password-reset-request', limit: 3, windowSec: 300 }),
    (0, swagger_1.ApiOperation)({ summary: 'Send password reset email' }),
    (0, swagger_1.ApiBody)({ type: forgot_password_dto_1.ForgotPasswordDto, description: 'Password reset request payload' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Password reset request processed successfully.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "requestPasswordReset", null);
__decorate([
    (0, common_1.Post)('password/reset/confirm'),
    (0, common_2.HttpCode)(200),
    (0, common_1.UseGuards)(rate_limit_guard_1.RateLimitGuard),
    (0, rate_limit_decorator_1.RateLimit)({ key: 'auth:password-reset-confirm', limit: 5, windowSec: 300 }),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm password reset token' }),
    (0, swagger_1.ApiBody)({ type: confirm_password_reset_dto_1.ConfirmPasswordResetDto, description: 'Password reset confirmation payload' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Password reset completed successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "code: 'TOKEN_REQUIRED' | code: 'PASSWORD_REQUIRED' | code: 'TOKEN_INVALID_OR_EXPIRED'" }),
    (0, swagger_1.ApiResponse)({ status: 429, description: "code: 'RATE_LIMIT_EXCEEDED'" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [confirm_password_reset_dto_1.ConfirmPasswordResetDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "confirmPasswordReset", null);
__decorate([
    (0, common_1.Post)('password/change'),
    (0, common_2.HttpCode)(200),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, rate_limit_guard_1.RateLimitGuard),
    (0, rate_limit_decorator_1.RateLimit)({ key: 'auth:password-change', limit: 5, windowSec: 300 }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Change password for authenticated user' }),
    (0, swagger_1.ApiBody)({ type: change_password_dto_1.ChangePasswordDto, description: 'Password change payload' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Password changed successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "code: 'NEW_PASSWORD_REQUIRED' | code: 'PASSWORD_SHOULD_DIFFER' | code: 'CURRENT_PASSWORD_REQUIRED'" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED' | code: 'USER_NOT_FOUND' | code: 'INVALID_CURRENT_PASSWORD'" }),
    (0, swagger_1.ApiResponse)({ status: 429, description: "code: 'RATE_LIMIT_EXCEEDED'" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    (0, swagger_1.ApiOperation)({ summary: 'Start Google OAuth flow' }),
    (0, swagger_1.ApiResponse)({ status: 302, description: 'Redirect to Google OAuth consent screen.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    (0, swagger_1.ApiOperation)({ summary: 'Handle Google OAuth callback' }),
    (0, swagger_1.ApiResponse)({ status: 302, description: 'Redirect to the client application after Google authentication.' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_3.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthCallback", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map