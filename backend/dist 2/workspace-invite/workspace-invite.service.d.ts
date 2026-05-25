import { PrismaService } from '../prisma/prisma.service';
import { SendInviteDto } from './dto/send-invite.dto';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { WorkspaceService } from '../workspace/workspace.service';
import { WorkspaceActivityService } from '../workspace-activity/workspace-activity.service';
import { PaginationDto } from '../workspace/dto/pagination.dto';
import type { MyWorkspaceInviteRow, WorkspaceInviteCreated, WorkspaceInviteListItem } from './interface';
export declare class WorkspaceInviteService {
    private readonly prisma;
    private readonly mailService;
    private readonly configService;
    private readonly workspaceService;
    private readonly workspaceActivityService;
    constructor(prisma: PrismaService, mailService: MailService, configService: ConfigService, workspaceService: WorkspaceService, workspaceActivityService: WorkspaceActivityService);
    sendInvite(dto: SendInviteDto, userId: number, workspaceId: number): Promise<WorkspaceInviteCreated>;
    getWorkspaceInvites(workspaceId: number, paginationDto: PaginationDto): Promise<WorkspaceInviteListItem[]>;
    deleteInvite(inviteId: number, workspaceId: number, cancelledByUserId: number): Promise<{
        ok: boolean;
    }>;
    getMyInvites(userId: number, paginationDto: PaginationDto): Promise<MyWorkspaceInviteRow[]>;
    acceptInviteByToken(token: string, userId: number): Promise<{
        ok: boolean;
    }>;
    acceptInvite(inviteId: number, userId: number): Promise<{
        ok: boolean;
    }>;
    declineInvite(inviteId: number, userId: number): Promise<{
        ok: boolean;
    }>;
    private deleteInviteRecord;
    private getUserEmailOrThrow;
    private getInviteForEmailOrThrow;
    private ensureInviteIsActive;
    private hashToken;
    private throwInviteNotFound;
}
