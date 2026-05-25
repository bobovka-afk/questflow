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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../prisma/prisma.service");
let UserService = class UserService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getById(id) {
        const userId = Number(id);
        if (!Number.isInteger(userId))
            return null;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                avatarPath: true,
                passwordHash: true,
                createdAt: true,
            },
        });
        if (!user)
            return null;
        return this.toUserPublic(user);
    }
    async findByEmail(email) {
        const normalizedEmail = this.normalizeEmail(email);
        return this.prisma.user.findUnique({
            where: { email: normalizedEmail },
        });
    }
    async getProfileForViewer(targetUserId, viewerUserId) {
        const targetUser = await this.prisma.user.findUnique({
            where: { id: targetUserId },
            select: {
                id: true,
                name: true,
                avatarPath: true,
                email: true,
                createdAt: true,
            },
        });
        if (!targetUser) {
            throw new common_1.NotFoundException({
                code: 'USER_NOT_FOUND',
                message: 'User not found',
            });
        }
        const shared = await this.prisma.workspaceMember.findFirst({
            where: {
                userId: viewerUserId,
                workspace: {
                    members: { some: { userId: targetUserId } },
                },
            },
            select: { id: true },
        });
        if (!shared) {
            throw new common_1.ForbiddenException({
                code: 'ACCESS_DENIED',
                message: 'You are not allowed to access this profile',
            });
        }
        return targetUser;
    }
    async create(dto) {
        const normalizedEmail = this.normalizeEmail(dto.email);
        const user = await this.prisma.user.create({
            data: {
                email: normalizedEmail,
                name: dto.name,
                passwordHash: await bcrypt.hash(dto.password, 10),
            },
        });
        return this.toUserPublic(user);
    }
    async createOAuthUser(email, name, picture) {
        const normalizedEmail = this.normalizeEmail(email);
        const user = await this.prisma.user.create({
            data: {
                email: normalizedEmail,
                name,
                avatarPath: picture,
                emailVerifiedAt: new Date(),
            },
        });
        return user;
    }
    async updateAvatar(id, avatarPath) {
        const user = await this.prisma.user.update({
            where: { id },
            data: { avatarPath },
            select: {
                id: true,
                email: true,
                name: true,
                avatarPath: true,
                passwordHash: true,
                createdAt: true,
            },
        });
        return this.toUserPublic(user);
    }
    async removeAvatar(id) {
        const user = await this.prisma.user.update({
            where: { id },
            data: { avatarPath: null },
            select: {
                id: true,
                email: true,
                name: true,
                avatarPath: true,
                passwordHash: true,
                createdAt: true,
            },
        });
        return this.toUserPublic(user);
    }
    async updateName(id, name) {
        const user = await this.prisma.user.update({
            where: { id },
            data: { name },
            select: {
                id: true,
                email: true,
                name: true,
                avatarPath: true,
                passwordHash: true,
                createdAt: true,
            },
        });
        return this.toUserPublic(user);
    }
    normalizeEmail(email) {
        return email.trim().toLowerCase();
    }
    toUserPublic(user) {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            avatarPath: user.avatarPath,
            hasPassword: Boolean(user.passwordHash),
            createdAt: user.createdAt,
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map