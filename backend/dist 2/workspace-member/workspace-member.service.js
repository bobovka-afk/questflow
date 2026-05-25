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
exports.WorkspaceMemberService = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("../generated/prisma/enums");
const prisma_service_1 = require("../prisma/prisma.service");
const workspace_activity_service_1 = require("../workspace-activity/workspace-activity.service");
let WorkspaceMemberService = class WorkspaceMemberService {
    prisma;
    workspaceActivityService;
    constructor(prisma, workspaceActivityService) {
        this.prisma = prisma;
        this.workspaceActivityService = workspaceActivityService;
    }
    async getWorkspaceMembers(workspaceId, paginationDto) {
        return this.prisma.workspaceMember.findMany({
            where: { workspaceId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatarPath: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: paginationDto.limit,
            skip: paginationDto.offset,
        });
    }
    async deleteWorkspaceMember(workspaceId, memberId, actorUserId) {
        await this.prisma.$transaction(async (tx) => {
            const targetMember = await tx.workspaceMember.findUnique({
                where: {
                    workspaceId_userId: {
                        workspaceId,
                        userId: memberId,
                    },
                },
                include: {
                    user: { select: { email: true, name: true } },
                },
            });
            if (!targetMember) {
                throw new common_1.ForbiddenException({
                    code: 'WORKSPACE_MEMBER_REQUIRED',
                    message: 'You are not a member of this workspace',
                });
            }
            if (targetMember.role === enums_1.WorkspaceRole.OWNER) {
                throw new common_1.ForbiddenException({
                    code: 'WORKSPACE_OWNER_CANNOT_BE_REMOVED',
                    message: 'You cannot remove workspace OWNER. Transfer ownership first.',
                });
            }
            await tx.workspaceMember.delete({
                where: {
                    workspaceId_userId: {
                        workspaceId,
                        userId: memberId,
                    },
                },
            });
            await this.workspaceActivityService.record(tx, {
                workspaceId,
                actorUserId,
                type: enums_1.WorkspaceActivityType.MEMBER_REMOVED,
                payload: {
                    removedUserId: memberId,
                    removedUserEmail: targetMember.user.email,
                    removedUserName: targetMember.user.name,
                },
            });
        });
        return { ok: true };
    }
    async leaveWorkspace(userId, workspaceId) {
        await this.prisma.$transaction(async (tx) => {
            await this.workspaceActivityService.record(tx, {
                workspaceId,
                actorUserId: userId,
                type: enums_1.WorkspaceActivityType.MEMBER_LEFT,
                payload: {},
            });
            await tx.workspaceMember.delete({
                where: {
                    workspaceId_userId: {
                        userId,
                        workspaceId,
                    },
                },
            });
        });
        return { ok: true };
    }
    async getWorkspaceMemberOrThrow(workspaceId, userId) {
        const member = await this.prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId,
                },
            },
        });
        if (!member) {
            throw new common_1.ForbiddenException({
                code: 'WORKSPACE_MEMBER_REQUIRED',
                message: 'You are not a member of this workspace',
            });
        }
        return member;
    }
};
exports.WorkspaceMemberService = WorkspaceMemberService;
exports.WorkspaceMemberService = WorkspaceMemberService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        workspace_activity_service_1.WorkspaceActivityService])
], WorkspaceMemberService);
//# sourceMappingURL=workspace-member.service.js.map