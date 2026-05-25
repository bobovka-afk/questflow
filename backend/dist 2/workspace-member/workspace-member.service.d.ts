import { PrismaService } from '../prisma/prisma.service';
import { WorkspaceActivityService } from '../workspace-activity/workspace-activity.service';
import { PaginationDto } from '../workspace/dto/pagination.dto';
import type { WorkspaceMemberWithUser } from './interface';
export declare class WorkspaceMemberService {
    private readonly prisma;
    private readonly workspaceActivityService;
    constructor(prisma: PrismaService, workspaceActivityService: WorkspaceActivityService);
    getWorkspaceMembers(workspaceId: number, paginationDto: PaginationDto): Promise<WorkspaceMemberWithUser[]>;
    deleteWorkspaceMember(workspaceId: number, memberId: number, actorUserId: number): Promise<{
        ok: boolean;
    }>;
    leaveWorkspace(userId: number, workspaceId: number): Promise<{
        ok: boolean;
    }>;
    private getWorkspaceMemberOrThrow;
}
