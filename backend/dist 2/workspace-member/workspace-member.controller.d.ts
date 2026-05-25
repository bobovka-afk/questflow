import { PaginationDto } from '../workspace/dto/pagination.dto';
import { WorkspaceMemberService } from './workspace-member.service';
import type { WorkspaceMemberWithUser } from './interface';
import type { AuthedRequest } from '../common/type';
export declare class WorkspaceMemberController {
    private readonly workspaceMemberService;
    constructor(workspaceMemberService: WorkspaceMemberService);
    getMembersWorkspace(workspaceId: number, paginationDto: PaginationDto): Promise<WorkspaceMemberWithUser[]>;
    deleteWorkspaceMember(req: AuthedRequest, workspaceId: number, memberId: number): Promise<{
        ok: boolean;
    }>;
    leaveWorkspace(req: AuthedRequest, workspaceId: number): Promise<{
        ok: boolean;
    }>;
}
