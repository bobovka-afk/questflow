import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';
import { WorkspaceActivityService } from '../workspace-activity/workspace-activity.service';
import { WorkspaceActivityType } from '../generated/prisma/enums';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import {
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { PaginationDto } from './dto/pagination.dto';
import { ReorderUserWorkspaceDto } from './dto/reorder-user-workspace.dto';
import { WorkspaceRole } from '../generated/prisma/enums';
import { resolveMemberPermissions } from './lib/member-permissions';
import { nextWorkspaceMemberSortOrder } from './lib/member-sort-order';
import type {
    WorkspaceCreated,
    WorkspaceIdRef,
    WorkspaceSummary,
    WorkspaceUpdated,
    UserWorkspaceRow,
} from './interface';

@Injectable()
export class WorkspaceService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly workspaceActivityService: WorkspaceActivityService,
    ) {}


    async createWorkspace(
        dto: CreateWorkspaceDto,
        userId: number,
    ): Promise<WorkspaceCreated> {
        const workspace = await this.prisma.$transaction(async (tx) => {
            const sortOrder = await nextWorkspaceMemberSortOrder(tx, userId);
            const created = await tx.workspace.create({
                data: {
                    name: dto.name,
                    description: dto.description,
                    members: {
                        create: {
                            userId: userId,
                            role: WorkspaceRole.OWNER,
                            sortOrder,
                        },
                    },
                },
            });
            await this.workspaceActivityService.record(tx, {
                workspaceId: created.id,
                actorUserId: userId,
                type: WorkspaceActivityType.WORKSPACE_CREATED,
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

    async getWorkspaceSummary(
        workspaceId: number,
        userId: number,
    ): Promise<WorkspaceSummary> {
        const workspace = await this.prisma.workspace.findUnique({
            where: { id: workspaceId },
            select: {
                id: true,
                name: true,
                description: true,
            },
        });
        if (!workspace) {
            throw new NotFoundException({
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
            select: { role: true, permissions: true },
        });
        return {
            ...workspace,
            myRole: member?.role ?? null,
            myPermissions: member
              ? resolveMemberPermissions(member.role, member.permissions)
              : null,
        };
    }

    async getUserWorkspaces(
        userId: number,
        paginationDto: PaginationDto,
    ): Promise<UserWorkspaceRow[]> {
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
            orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
            take: paginationDto.limit,
            skip: paginationDto.offset,
        });
    }

    async updateWorkspace(
        workspaceId: number,
        dto: UpdateWorkspaceDto,
        actorUserId: number,
    ): Promise<WorkspaceUpdated> {
        if (dto.name === undefined && dto.description === undefined) {
            throw new BadRequestException({
                code: 'WORKSPACE_UPDATE_FIELDS_REQUIRED',
                message: 'Provide at least one field: name or description',
            });
        }

        const existing = await this.prisma.workspace.findUnique({
            where: { id: workspaceId },
            select: { name: true, description: true },
        });
        if (!existing) {
            throw new NotFoundException({
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

            const payload: Record<string, { from: unknown; to: unknown }> = {};
            if (
                dto.name !== undefined &&
                dto.name !== existing.name
            ) {
                payload.name = { from: existing.name, to: updated.name };
            }
            if (
                dto.description !== undefined &&
                dto.description !== existing.description
            ) {
                payload.description = {
                    from: existing.description,
                    to: updated.description,
                };
            }

            if (Object.keys(payload).length > 0) {
                await this.workspaceActivityService.record(tx, {
                    workspaceId,
                    actorUserId,
                    type: WorkspaceActivityType.WORKSPACE_UPDATED,
                    payload: payload as Prisma.InputJsonValue,
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

    async deleteWorkspace(workspaceId: number): Promise<{ ok: boolean }> {
        await this.prisma.workspace.delete({
            where: { id: workspaceId },
        })
        return { ok: true }
    }

    async getWorkspaceOrThrow(workspaceId: number): Promise<WorkspaceIdRef> {
        const workspace = await this.prisma.workspace.findUnique({
            where: { id: workspaceId },
            select: { id: true },
        });
        if (!workspace) {
            throw new NotFoundException({
                code: 'WORKSPACE_NOT_FOUND',
                message: 'Workspace not found',
            });
        }
        return workspace;
    }

    async reorderUserWorkspace(
        userId: number,
        dto: ReorderUserWorkspaceDto,
    ): Promise<{ ok: boolean }> {
        await this.prisma.$transaction(async (tx) => {
            const member = await tx.workspaceMember.findFirst({
                where: { id: dto.memberId, userId },
                select: { id: true },
            });
            if (!member) {
                throw new NotFoundException({
                    code: 'WORKSPACE_MEMBER_NOT_FOUND',
                    message: 'Workspace membership not found',
                });
            }

            const members = await tx.workspaceMember.findMany({
                where: { userId },
                orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
                select: { id: true },
            });

            const ids = members.map((row) => row.id);
            const withoutMoved = ids.filter((id) => id !== dto.memberId);
            const insertAt = Math.min(
                Math.max(0, dto.position),
                withoutMoved.length,
            );
            const newOrder = [
                ...withoutMoved.slice(0, insertAt),
                dto.memberId,
                ...withoutMoved.slice(insertAt),
            ];

            for (let i = 0; i < newOrder.length; i++) {
                await tx.workspaceMember.update({
                    where: { id: newOrder[i] },
                    data: { sortOrder: i },
                });
            }
        });

        return { ok: true };
    }

}
