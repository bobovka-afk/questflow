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
exports.WorkspaceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const workspace_activity_service_1 = require("../workspace-activity/workspace-activity.service");
const enums_1 = require("../generated/prisma/enums");
const common_2 = require("@nestjs/common");
const enums_2 = require("../generated/prisma/enums");
let WorkspaceService = class WorkspaceService {
    prisma;
    workspaceActivityService;
    constructor(prisma, workspaceActivityService) {
        this.prisma = prisma;
        this.workspaceActivityService = workspaceActivityService;
    }
    async createWorkspace(dto, userId) {
        const workspace = await this.prisma.$transaction(async (tx) => {
            const created = await tx.workspace.create({
                data: {
                    name: dto.name,
                    description: dto.description,
                    members: {
                        create: {
                            userId: userId,
                            role: enums_2.WorkspaceRole.OWNER,
                        },
                    },
                },
            });
            await this.workspaceActivityService.record(tx, {
                workspaceId: created.id,
                actorUserId: userId,
                type: enums_1.WorkspaceActivityType.WORKSPACE_CREATED,
                payload: {
                    name: created.name,
                    description: created.description,
                },
            });
            return created;
        });
        return {
            id: workspace.id,
            name: workspace.name,
            description: workspace.description,
            createdAt: workspace.createdAt,
        };
    }
    async getWorkspaceSummary(workspaceId, userId) {
        const workspace = await this.prisma.workspace.findUnique({
            where: { id: workspaceId },
            select: {
                id: true,
                name: true,
                description: true,
            },
        });
        if (!workspace) {
            throw new common_2.NotFoundException({
                code: 'WORKSPACE_NOT_FOUND',
                message: 'Workspace not found',
            });
        }
        const member = await this.prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId,
                },
            },
            select: { role: true },
        });
        return {
            ...workspace,
            myRole: member?.role ?? null,
        };
    }
    async getUserWorkspaces(userId, paginationDto) {
        return this.prisma.workspaceMember.findMany({
            where: { userId: userId },
            select: {
                id: true,
                workspaceId: true,
                userId: true,
                role: true,
                createdAt: true,
                workspace: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    },
                },
            },
            orderBy: {
                workspace: {
                    updatedAt: 'desc',
                },
            },
            take: paginationDto.limit,
            skip: paginationDto.offset,
        });
    }
    async updateWorkspace(workspaceId, dto, actorUserId) {
        if (dto.name === undefined && dto.description === undefined) {
            throw new common_2.BadRequestException({
                code: 'WORKSPACE_UPDATE_FIELDS_REQUIRED',
                message: 'Provide at least one field: name or description',
            });
        }
        const existing = await this.prisma.workspace.findUnique({
            where: { id: workspaceId },
            select: { name: true, description: true },
        });
        if (!existing) {
            throw new common_2.NotFoundException({
                code: 'WORKSPACE_NOT_FOUND',
                message: 'Workspace not found',
            });
        }
        const workspace = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.workspace.update({
                where: { id: workspaceId },
                data: {
                    name: dto.name,
                    description: dto.description,
                },
            });
            const payload = {};
            if (dto.name !== undefined &&
                dto.name !== existing.name) {
                payload.name = { from: existing.name, to: updated.name };
            }
            if (dto.description !== undefined &&
                dto.description !== existing.description) {
                payload.description = {
                    from: existing.description,
                    to: updated.description,
                };
            }
            if (Object.keys(payload).length > 0) {
                await this.workspaceActivityService.record(tx, {
                    workspaceId,
                    actorUserId,
                    type: enums_1.WorkspaceActivityType.WORKSPACE_UPDATED,
                    payload: payload,
                });
            }
            return updated;
        });
        return {
            id: workspace.id,
            name: workspace.name,
            description: workspace.description,
        };
    }
    async deleteWorkspace(workspaceId) {
        await this.prisma.workspace.delete({
            where: { id: workspaceId },
        });
        return { ok: true };
    }
    async getWorkspaceOrThrow(workspaceId) {
        const workspace = await this.prisma.workspace.findUnique({
            where: { id: workspaceId },
            select: { id: true },
        });
        if (!workspace) {
            throw new common_2.NotFoundException({
                code: 'WORKSPACE_NOT_FOUND',
                message: 'Workspace not found',
            });
        }
        return workspace;
    }
};
exports.WorkspaceService = WorkspaceService;
exports.WorkspaceService = WorkspaceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        workspace_activity_service_1.WorkspaceActivityService])
], WorkspaceService);
//# sourceMappingURL=workspace.service.js.map