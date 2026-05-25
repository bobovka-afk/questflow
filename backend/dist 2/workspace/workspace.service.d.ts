import { PrismaService } from '../prisma/prisma.service';
import { WorkspaceActivityService } from '../workspace-activity/workspace-activity.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { PaginationDto } from './dto/pagination.dto';
import type { WorkspaceCreated, WorkspaceIdRef, WorkspaceSummary, WorkspaceUpdated, UserWorkspaceRow } from './interface';
export declare class WorkspaceService {
    private readonly prisma;
    private readonly workspaceActivityService;
    constructor(prisma: PrismaService, workspaceActivityService: WorkspaceActivityService);
    createWorkspace(dto: CreateWorkspaceDto, userId: number): Promise<WorkspaceCreated>;
    getWorkspaceSummary(workspaceId: number, userId: number): Promise<WorkspaceSummary>;
    getUserWorkspaces(userId: number, paginationDto: PaginationDto): Promise<UserWorkspaceRow[]>;
    updateWorkspace(workspaceId: number, dto: UpdateWorkspaceDto, actorUserId: number): Promise<WorkspaceUpdated>;
    deleteWorkspace(workspaceId: number): Promise<{
        ok: boolean;
    }>;
    getWorkspaceOrThrow(workspaceId: number): Promise<WorkspaceIdRef>;
}
