import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import type { UserWorkspaceRow, WorkspaceCreated, WorkspaceSummary, WorkspaceUpdated } from './interface';
import type { AuthedRequest } from '../common/type';
export declare class WorkspaceController {
    private readonly workspaceService;
    constructor(workspaceService: WorkspaceService);
    createWorkspace(req: AuthedRequest, dto: CreateWorkspaceDto): Promise<WorkspaceCreated>;
    getUserWorkspaces(req: AuthedRequest, paginationDto: PaginationDto): Promise<UserWorkspaceRow[]>;
    getWorkspaceSummary(workspaceId: number, req: AuthedRequest): Promise<WorkspaceSummary>;
    updateWorkspace(workspaceId: number, dto: UpdateWorkspaceDto, req: AuthedRequest): Promise<WorkspaceUpdated>;
    deleteWorkspace(workspaceId: number): Promise<{
        ok: boolean;
    }>;
}
