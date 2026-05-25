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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const user_service_1 = require("../user/user.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const enums_1 = require("../generated/prisma/enums");
let AuthService = class AuthService {
    userService;
    jwtService;
    configService;
    prisma;
    mailService;
    EXPIRE_DAY_REFRESH_TOKEN = 7;
    REFRESH_TOKEN_NAME = 'refreshToken';
    constructor(userService, jwtService, configService, prisma, mailService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.prisma = prisma;
        this.mailService = mailService;
    }
    async register(registerDto) {
        const normalizedEmail = this.normalizeEmail(registerDto.email);
        const oldUser = await this.userService.findByEmail(normalizedEmail);
        if (oldUser) {
            throw new common_1.BadRequestException({
                code: 'EMAIL_ALREADY_EXISTS',
                message: 'User with this email already exists',
            });
        }
        const user = await this.userService.create({
            ...registerDto,
            email: normalizedEmail,
        });
        try {
            await this.requestEmailVerification(normalizedEmail);
        }
        catch (error) {
            console.error('Failed to send email verification message:', error);
        }
        return user;
    }
    async login(loginDto) {
        return this.signIn(loginDto);
    }
    async getNewTokens(refreshToken) {
        try {
            const result = await this.jwtService.verifyAsync(refreshToken);
            const user = await this.userService.getById(result.id);
            if (!user) {
                throw new common_1.UnauthorizedException({
                    code: 'USER_NOT_FOUND',
                    message: 'User not found',
                });
            }
            const tokens = this.issueTokens(user.id);
            return { user, ...tokens };
        }
        catch {
            throw new common_1.UnauthorizedException({
                code: 'INVALID_REFRESH_TOKEN',
                message: 'Invalid refresh token',
            });
        }
    }
    issueTokens(userId) {
        const data = { id: String(userId) };
        const accessToken = this.jwtService.sign(data, {
            expiresIn: '1h'
        });
        const refreshToken = this.jwtService.sign(data, {
            expiresIn: '7d'
        });
        return { accessToken, refreshToken };
    }
    async validateOAuthLogin(req) {
        const normalizedEmail = this.normalizeEmail(req.user.email);
        let user = await this.userService.findByEmail(normalizedEmail);
        if (!user) {
            user = await this.userService.createOAuthUser(normalizedEmail, req.user.name, req.user.picture);
        }
        else if (!user.emailVerifiedAt) {
            user = await this.prisma.user.update({
                where: { id: user.id },
                data: { emailVerifiedAt: new Date() },
            });
        }
        const tokens = this.issueTokens(user.id);
        return { user: user, ...tokens };
    }
    addRefreshTokenToResponse(res, refreshToken) {
        const expiresIn = new Date();
        expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);
        res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
            httpOnly: true,
            domain: this.configService.get('SERVER_DOMAIN'),
            expires: expiresIn,
            secure: true,
            sameSite: 'none'
        });
    }
    removeRefreshTokenFromResponse(res) {
        res.cookie(this.REFRESH_TOKEN_NAME, '', {
            httpOnly: true,
            domain: this.configService.get('SERVER_DOMAIN'),
            expires: new Date(0),
            secure: true,
            sameSite: 'none'
        });
    }
    async requestEmailVerification(email) {
        const normalizedEmail = this.normalizeEmail(email);
        const user = await this.userService.findByEmail(normalizedEmail);
        if (!user || user.emailVerifiedAt)
            return { ok: true };
        const token = this.generateToken();
        const tokenHash = this.hashToken(token);
        const expiresAt = new Date(Date.now() + this.getEmailVerificationTtlMs());
        await this.prisma.authToken.create({
            data: {
                userId: user.id,
                type: enums_1.AuthTokenType.EMAIL_VERIFICATION,
                tokenHash,
                expiresAt,
            },
        });
        const serverUrl = this.configService.get('SERVER_URL') || '';
        const verificationUrl = `${serverUrl}/auth/email/verification/confirm?token=${token}`;
        await this.mailService.sendEmailVerification(user.email, verificationUrl);
        return { ok: true };
    }
    async confirmEmailVerification(token) {
        if (!token) {
            throw new common_1.BadRequestException({
                code: 'TOKEN_REQUIRED',
                message: 'Token is required',
            });
        }
        const tokenHash = this.hashToken(token);
        const authToken = await this.prisma.authToken.findUnique({
            where: { tokenHash },
            include: { user: true },
        });
        const now = new Date();
        const isValid = authToken &&
            authToken.type === enums_1.AuthTokenType.EMAIL_VERIFICATION &&
            !authToken.usedAt &&
            authToken.expiresAt > now;
        if (!isValid) {
            throw new common_1.BadRequestException({
                code: 'TOKEN_INVALID_OR_EXPIRED',
                message: 'Token is invalid or expired',
            });
        }
        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: authToken.userId },
                data: { emailVerifiedAt: now },
            }),
            this.prisma.authToken.update({
                where: { id: authToken.id },
                data: { usedAt: now },
            }),
        ]);
        return { ok: true };
    }
    async requestPasswordReset(email) {
        const normalizedEmail = this.normalizeEmail(email);
        const user = await this.userService.findByEmail(normalizedEmail);
        if (!user)
            return { ok: true };
        const token = this.generateToken();
        const tokenHash = this.hashToken(token);
        const expiresAt = new Date(Date.now() + this.getPasswordResetTtlMs());
        await this.prisma.authToken.create({
            data: {
                userId: user.id,
                type: enums_1.AuthTokenType.PASSWORD_RESET,
                tokenHash,
                expiresAt,
            },
        });
        const clientUrl = this.configService.get('CLIENT_URL') || '';
        const resetUrl = `${clientUrl}/reset-password?token=${token}`;
        await this.mailService.sendPasswordReset(user.email, resetUrl);
        return { ok: true };
    }
    async confirmPasswordReset(token, newPassword) {
        if (!token) {
            throw new common_1.BadRequestException({
                code: 'TOKEN_REQUIRED',
                message: 'Token is required',
            });
        }
        if (!newPassword) {
            throw new common_1.BadRequestException({
                code: 'PASSWORD_REQUIRED',
                message: 'Password is required',
            });
        }
        const tokenHash = this.hashToken(token);
        const authToken = await this.prisma.authToken.findUnique({
            where: { tokenHash },
            include: { user: true },
        });
        const now = new Date();
        const isValid = authToken &&
            authToken.type === enums_1.AuthTokenType.PASSWORD_RESET &&
            !authToken.usedAt &&
            authToken.expiresAt > now;
        if (!isValid) {
            throw new common_1.BadRequestException({
                code: 'TOKEN_INVALID_OR_EXPIRED',
                message: 'Token is invalid or expired',
            });
        }
        const passwordHash = await bcrypt.hash(newPassword, 10);
        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: authToken.userId },
                data: { passwordHash },
            }),
            this.prisma.authToken.update({
                where: { id: authToken.id },
                data: { usedAt: now },
            }),
        ]);
        return { ok: true };
    }
    async changePassword(userId, currentPassword, newPassword) {
        if (!newPassword) {
            throw new common_1.BadRequestException({
                code: 'NEW_PASSWORD_REQUIRED',
                message: 'New password is required',
            });
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, passwordHash: true },
        });
        if (!user) {
            throw new common_1.UnauthorizedException({
                code: 'USER_NOT_FOUND',
                message: 'User not found',
            });
        }
        if (user.passwordHash) {
            if (!currentPassword) {
                throw new common_1.BadRequestException({
                    code: 'CURRENT_PASSWORD_REQUIRED',
                    message: 'Current password is required',
                });
            }
            if (currentPassword === newPassword) {
                throw new common_1.BadRequestException({
                    code: 'PASSWORD_SHOULD_DIFFER',
                    message: 'New password must be different from current password',
                });
            }
            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
            if (!isCurrentPasswordValid) {
                throw new common_1.UnauthorizedException({
                    code: 'INVALID_CURRENT_PASSWORD',
                    message: 'Current password is invalid',
                });
            }
        }
        const passwordHash = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { passwordHash },
        });
        return { ok: true };
    }
    async signIn(loginDto) {
        const user = await this.validateUser(loginDto);
        const tokens = this.issueTokens(user.id);
        return { user, ...tokens };
    }
    async validateUser(loginDto) {
        const normalizedEmail = this.normalizeEmail(loginDto.email);
        const user = await this.userService.findByEmail(normalizedEmail);
        if (!user) {
            this.throwInvalidCredentials();
        }
        if (!user.passwordHash) {
            this.throwInvalidCredentials();
        }
        const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
        if (!isMatch) {
            this.throwInvalidCredentials();
        }
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
        };
    }
    normalizeEmail(email) {
        return email.trim().toLowerCase();
    }
    throwInvalidCredentials() {
        throw new common_1.UnauthorizedException({
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
        });
    }
    generateToken() {
        return crypto.randomBytes(32).toString('hex');
    }
    hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
    getEmailVerificationTtlMs() {
        const minutes = Number(this.configService.get('EMAIL_VERIFICATION_TTL_MINUTES')) ||
            60 * 24;
        return minutes * 60 * 1000;
    }
    getPasswordResetTtlMs() {
        const minutes = Number(this.configService.get('PASSWORD_RESET_TTL_MINUTES')) || 30;
        return minutes * 60 * 1000;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        config_1.ConfigService,
        prisma_service_1.PrismaService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map