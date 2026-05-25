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
exports.WorkspaceInviteService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("../generated/prisma/client");
const crypto = require("crypto");
const enums_1 = require("../generated/prisma/enums");
const mail_service_1 = require("../mail/mail.service");
const config_1 = require("@nestjs/config");
const workspace_service_1 = require("../workspace/workspace.service");
const workspace_activity_service_1 = require("../workspace-activity/workspace-activity.service");
const enums_2 = require("../generated/prisma/enums");
let WorkspaceInviteService = class WorkspaceInviteService {
    prisma;
    mailService;
    configService;
    workspaceService;
    workspaceActivityService;
    constructor(prisma, mailService, configService, workspaceService, workspaceActivityService) {
        this.prisma = prisma;
        this.mailService = mailService;
        this.configService = configService;
        this.workspaceService = workspaceService;
        this.workspaceActivityService = workspaceActivityService;
    }
    async sendInvite(dto, userId, workspaceId) {
        const invitedUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (invitedUser) {
            const existingMember = await this.prisma.workspaceMember.findUnique({
                where: {
                    workspaceId_userId: {
                        workspaceId,
                        userId: invitedUser.id,
                    },
                },
            });
            if (existingMember) {
                throw new common_1.ConflictException({
                    code: 'USER_ALREADY_MEMBER',
                    message: 'User is already a workspace member',
                });
            }
        }
        const token = crypto.randomBytes(32).toString('hex');
        let invite;
        try {
            invite = await this.prisma.workspaceInvite.create({
                data: {
                    email: dto.email,
                    workspaceId: workspaceId,
                    invitedByUserId: userId,
                    role: dto.role,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    tokenHash: this.hashToken(token),
                },
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                throw new common_1.ConflictException({
                    code: 'INVITE_ALREADY_SENT',
                    message: 'Invite has already been sent',
                });
            }
            throw error;
        }
        const workspace = await this.prisma.workspace.findUnique({
            where: { id: workspaceId },
            select: { name: true },
        });
        const workspaceName = workspace?.name ?? '';
        const clientUrl = this.configService.get('CLIENT_URL') || '';
        const inviteUrl = `${clientUrl}/invite?token=${token}`;
        try {
            await this.mailService.sendWorkspaceInvite(dto.email, inviteUrl, workspaceName);
        }
        catch {
            await this.prisma.workspaceInvite
                .delete({ where: { id: invite.id } })
                .catch(() => undefined);
            throw new common_1.ServiceUnavailableException({
                code: 'INVITE_MAIL_FAILED',
                message: 'Could not send invitation email',
            });
        }
        await this.workspaceActivityService.record(this.prisma, {
            workspaceId,
            actorUserId: userId,
            type: enums_2.WorkspaceActivityType.MEMBER_INVITED,
            payload: {
                invitedEmail: dto.email,
                role: dto.role,
            },
        });
        return { id: invite.id };
    }
    async getWorkspaceInvites(workspaceId, paginationDto) {
        const now = new Date();
        return this.prisma.workspaceInvite.findMany({
            where: {
                workspaceId,
                status: enums_1.WorkspaceInviteStatus.PENDING,
                expiresAt: { gt: now },
            },
            select: {
                id: true,
                email: true,
                role: true,
                expiresAt: true,
                createdAt: true,
                invitedBy: {
                    select: { id: true, email: true },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: paginationDto.limit,
            skip: paginationDto.offset,
        });
    }
    async deleteInvite(inviteId, workspaceId, cancelledByUserId) {
        await this.prisma.$transaction(async (tx) => {
            const invite = await tx.workspaceInvite.findFirst({
                where: { id: inviteId, workspaceId },
                select: { id: true, email: true, role: true },
            });
            if (!invite) {
                this.throwInviteNotFound();
            }
            await tx.workspaceInvite.delete({
                where: { id: invite.id },
            });
            await this.workspaceActivityService.record(tx, {
                workspaceId,
                actorUserId: cancelledByUserId,
                type: enums_2.WorkspaceActivityType.INVITE_CANCELLED,
                payload: {
                    invitedEmail: invite.email,
                    role: invite.role,
                },
            });
        });
        return { ok: true };
    }
    async getMyInvites(userId, paginationDto) {
        const currentUserEmail = await this.getUserEmailOrThrow(userId);
        return this.prisma.workspaceInvite.findMany({
            where: {
                email: currentUserEmail,
                status: enums_1.WorkspaceInviteStatus.PENDING,
            },
            select: {
                id: true,
                role: true,
                expiresAt: true,
                createdAt: true,
                workspace: {
                    select: { name: true },
                },
                invitedBy: {
                    select: { name: true, email: true },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: paginationDto.limit,
            skip: paginationDto.offset,
        });
    }
    async acceptInviteByToken(token, userId) {
        const tokenHash = this.hashToken(token);
        const invite = await this.prisma.workspaceInvite.findUnique({
            where: { tokenHash },
            select: { id: true },
        });
        if (!invite) {
            this.throwInviteNotFound();
        }
        return this.acceptInvite(invite.id, userId);
    }
    async acceptInvite(inviteId, userId) {
        const currentUserEmail = await this.getUserEmailOrThrow(userId);
        const invite = await this.getInviteForEmailOrThrow(inviteId, currentUserEmail);
        this.ensureInviteIsActive(invite.status, invite.expiresAt);
        await this.workspaceService.getWorkspaceOrThrow(invite.workspaceId);
        try {
            await this.prisma.$transaction(async (tx) => {
                await tx.workspaceMember.create({
                    data: {
                        workspaceId: invite.workspaceId,
                        userId,
                        role: invite.role,
                    },
                });
                await this.workspaceActivityService.record(tx, {
                    workspaceId: invite.workspaceId,
                    actorUserId: userId,
                    type: enums_2.WorkspaceActivityType.INVITE_ACCEPTED,
                    payload: {
                        invitedEmail: invite.email,
                        role: invite.role,
                        joinedUserId: userId,
                    },
                });
                await this.deleteInviteRecord(tx, invite.id);
            });
            return { ok: true };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                throw new common_1.ConflictException({
                    code: 'USER_ALREADY_MEMBER',
                    message: 'User is already a workspace member',
                });
            }
            throw error;
        }
    }
    async declineInvite(inviteId, userId) {
        const currentUserEmail = await this.getUserEmailOrThrow(userId);
        const invite = await this.getInviteForEmailOrThrow(inviteId, currentUserEmail);
        this.ensureInviteIsActive(invite.status, invite.expiresAt);
        await this.workspaceService.getWorkspaceOrThrow(invite.workspaceId);
        await this.prisma.$transaction(async (tx) => {
            const deleted = await tx.workspaceInvite.deleteMany({
                where: {
                    id: invite.id,
                    email: currentUserEmail,
                    status: enums_1.WorkspaceInviteStatus.PENDING,
                },
            });
            if (deleted.count === 0) {
                this.throwInviteNotFound();
            }
            await this.workspaceActivityService.record(tx, {
                workspaceId: invite.workspaceId,
                actorUserId: userId,
                type: enums_2.WorkspaceActivityType.INVITE_DECLINED,
                payload: {
                    invitedEmail: invite.email,
                    role: invite.role,
                },
            });
        });
        return { ok: true };
    }
    async deleteInviteRecord(db, inviteId) {
        await db.workspaceInvite.delete({ where: { id: inviteId } });
    }
    async getUserEmailOrThrow(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { email: true },
        });
        if (!user) {
            throw new common_1.NotFoundException({
                code: 'USER_NOT_FOUND',
                message: 'User not found',
            });
        }
        return user.email;
    }
    async getInviteForEmailOrThrow(inviteId, email) {
        const invite = await this.prisma.workspaceInvite.findUnique({
            where: { id: inviteId },
            select: {
                id: true,
                email: true,
                workspaceId: true,
                role: true,
                status: true,
                expiresAt: true,
            },
        });
        if (!invite) {
            this.throwInviteNotFound();
        }
        if (invite.email !== email) {
            throw new common_1.ForbiddenException({
                code: 'INVITE_ACCESS_DENIED',
                message: 'You cannot access this invite',
            });
        }
        return invite;
    }
    ensureInviteIsActive(status, expiresAt) {
        if (status !== enums_1.WorkspaceInviteStatus.PENDING) {
            throw new common_1.ConflictException({
                code: 'INVITE_ALREADY_PROCESSED',
                message: 'Invite has already been processed',
            });
        }
        if (expiresAt < new Date()) {
            throw new common_1.BadRequestException({
                code: 'INVITE_EXPIRED',
                message: 'Invite has expired',
            });
        }
    }
    hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
    throwInviteNotFound() {
        throw new common_1.NotFoundException({
            code: 'INVITE_NOT_FOUND',
            message: 'Invite not found',
        });
    }
};
exports.WorkspaceInviteService = WorkspaceInviteService;
exports.WorkspaceInviteService = WorkspaceInviteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService,
        config_1.ConfigService,
        workspace_service_1.WorkspaceService,
        workspace_activity_service_1.WorkspaceActivityService])
], WorkspaceInviteService);
//# sourceMappingURL=workspace-invite.service.js.map