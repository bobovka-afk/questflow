import { WorkspaceInviteService } from './workspace-invite.service';
import { SendInviteDto } from './dto/send-invite.dto';
import { AcceptInviteTokenDto } from './dto/accept-invite-token.dto';
import { PaginationDto } from '../workspace/dto/pagination.dto';
import type { MyWorkspaceInviteRow, WorkspaceInviteCreated, WorkspaceInviteListItem } from './interface';
import type { AuthedRequest } from '../common/type';
export declare class WorkspaceInviteController {
    private readonly workspaceInviteService;
    constructor(workspaceInviteService: WorkspaceInviteService);
    getMyInvites(req: AuthedRequest, paginationDto: PaginationDto): Promise<MyWorkspaceInviteRow[]>;
    getWorkspaceInvites(workspaceId: number, paginationDto: PaginationDto): Promise<WorkspaceInviteListItem[]>;
    sendInvite(workspaceId: number, req: AuthedRequest, dto: SendInviteDto): Promise<WorkspaceInviteCreated>;
    acceptInviteByToken(req: AuthedRequest, dto: AcceptInviteTokenDto): Promise<{
        ok: boolean;
    }>;
    acceptInvite(inviteId: number, req: AuthedRequest): Promise<{
        ok: boolean;
    }>;
    declineInvite(inviteId: number, req: AuthedRequest): Promise<{
        ok: boolean;
    }>;
    deleteInvite(req: AuthedRequest, workspaceId: number, inviteId: number): Promise<{
        ok: boolean;
    }>;
}
