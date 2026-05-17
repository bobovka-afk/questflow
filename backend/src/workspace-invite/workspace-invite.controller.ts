import { Controller } from '@nestjs/common';
import { WorkspaceInviteService } from './workspace-invite.service';
import { UseGuards } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Query } from '@nestjs/common';
import { Delete } from '@nestjs/common';
import { SendInviteDto } from './dto/send-invite.dto';
import { AcceptInviteTokenDto } from './dto/accept-invite-token.dto';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { PaginationDto } from '../workspace/dto/pagination.dto';
import { WorkspaceAccessGuard } from '../common/guards/workspace-access.guard';
import { WorkspaceRoleGuard } from '../common/guards/workspace-role.guard';
import { WorkspaceRoles } from '../common/decorators/workspace-roles.decorator';
import { WorkspaceRole } from '../generated/prisma/enums';
import { RateLimit } from '../common/decorators/rate-limit.decorator';
import { RateLimitGuard } from '../common/guards/rate-limit.guard';
import {
  ApiBody,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type {
  MyWorkspaceInviteRow,
  WorkspaceInviteCreated,
  WorkspaceInviteListItem,
} from './interface';
import type { AuthedRequest } from '../common/type';

@ApiTags('workspace-invite')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workspace-invite')
export class WorkspaceInviteController {
  constructor(private readonly workspaceInviteService: WorkspaceInviteService) {}

  @Get('my')
  @ApiOperation({ summary: 'Get invites for current user' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Maximum number of records to return' })
  @ApiQuery({ name: 'offset', required: false, example: 0, description: 'Number of records to skip' })
  @ApiResponse({ status: 200, description: 'Current user invites returned successfully.' })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED'" })
  async getMyInvites(
    @Req() req: AuthedRequest,
    @Query() paginationDto: PaginationDto,
  ): Promise<MyWorkspaceInviteRow[]> {
      return this.workspaceInviteService.getMyInvites(req.user.id, paginationDto)
    }

  @UseGuards(WorkspaceAccessGuard, WorkspaceRoleGuard)
  @WorkspaceRoles(WorkspaceRole.OWNER, WorkspaceRole.ADMIN)
  @Get(':workspaceId')
  @ApiOperation({ summary: 'Get invites for a workspace' })
  @ApiParam({ name: 'workspaceId', example: 1, description: 'Workspace id' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Maximum number of records to return' })
  @ApiQuery({ name: 'offset', required: false, example: 0, description: 'Number of records to skip' })
  @ApiResponse({ status: 200, description: 'Workspace invites returned successfully.' })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED'" })
  @ApiResponse({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'WORKSPACE_ACTION_FORBIDDEN' | code: 'RESOURCE_WORKSPACE_MISMATCH'" })
  @ApiResponse({ status: 404, description: "code: 'WORKSPACE_NOT_FOUND'" })
  async getWorkspaceInvites(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Query() paginationDto: PaginationDto,
  ): Promise<WorkspaceInviteListItem[]> {
    return this.workspaceInviteService.getWorkspaceInvites(workspaceId, paginationDto);
  }

  @UseGuards(WorkspaceAccessGuard, WorkspaceRoleGuard)
  @WorkspaceRoles(WorkspaceRole.OWNER, WorkspaceRole.ADMIN)
  @Post('create/:workspaceId')
  @UseGuards(RateLimitGuard)
  @RateLimit({ key: 'workspace-invite:create', limit: 5, windowSec: 300 })
  @ApiOperation({ summary: 'Create workspace invite' })
  @ApiBody({ type: SendInviteDto, description: 'Workspace invite creation payload' })
  @ApiParam({ name: 'workspaceId', example: 1, description: 'Workspace id' })
  @ApiResponse({ status: 201, description: 'Workspace invite created successfully.' })
  @ApiResponse({ status: 400, description: "code: 'INVITE_MAIL_FAILED' | code: 'WORKSPACE_ID_REQUIRED'" })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED'" })
  @ApiResponse({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'WORKSPACE_ACTION_FORBIDDEN'" })
  @ApiResponse({ status: 409, description: "code: 'USER_ALREADY_MEMBER' | code: 'INVITE_ALREADY_SENT'" })
  @ApiResponse({ status: 429, description: "code: 'RATE_LIMIT_EXCEEDED'" })
  async sendInvite(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Req() req: AuthedRequest,
    @Body() dto: SendInviteDto,
  ): Promise<WorkspaceInviteCreated> {
      return this.workspaceInviteService.sendInvite(dto, req.user.id, workspaceId);
    }

  @Post('accept-token')
  @UseGuards(RateLimitGuard)
  @RateLimit({ key: 'workspace-invite:accept-token', limit: 10, windowSec: 300 })
  @ApiOperation({ summary: 'Accept workspace invite by token' })
  @ApiBody({ type: AcceptInviteTokenDto, description: 'Workspace invite token payload' })
  @ApiResponse({ status: 201, description: 'Workspace invite accepted successfully by token.' })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED'" })
  @ApiResponse({ status: 400, description: "code: 'INVITE_EXPIRED'" })
  @ApiResponse({ status: 403, description: "code: 'INVITE_ACCESS_DENIED'" })
  @ApiResponse({ status: 404, description: "code: 'INVITE_NOT_FOUND' | code: 'USER_NOT_FOUND'" })
  @ApiResponse({ status: 409, description: "code: 'INVITE_ALREADY_PROCESSED' | code: 'USER_ALREADY_MEMBER'" })
  @ApiResponse({ status: 429, description: "code: 'RATE_LIMIT_EXCEEDED'" })
  async acceptInviteByToken(
    @Req() req: AuthedRequest,
    @Body() dto: AcceptInviteTokenDto,
  ): Promise<{ ok: boolean }> {
    return this.workspaceInviteService.acceptInviteByToken(
      dto.token,
      req.user.id,
    );
  }

  @Post(':inviteId/accept')
  @ApiOperation({ summary: 'Accept workspace invite by id' })
  @ApiParam({ name: 'inviteId', example: 15, description: 'Invite id' })
  @ApiResponse({ status: 201, description: 'Workspace invite accepted successfully.' })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED'" })
  @ApiResponse({ status: 404, description: "code: 'INVITE_NOT_FOUND'" })
  @ApiResponse({ status: 400, description: "code: 'INVITE_EXPIRED'" })
  @ApiResponse({ status: 403, description: "code: 'INVITE_ACCESS_DENIED'" })
  @ApiResponse({ status: 409, description: "code: 'INVITE_ALREADY_PROCESSED' | code: 'USER_ALREADY_MEMBER'" })
  async acceptInvite(
    @Param('inviteId', ParseIntPipe) inviteId: number,
    @Req() req: AuthedRequest,
  ): Promise<{ ok: boolean }> {
    return this.workspaceInviteService.acceptInvite(inviteId, req.user.id);
  }

  @Post(':inviteId/decline')
  @ApiOperation({ summary: 'Decline workspace invite by id' })
  @ApiParam({ name: 'inviteId', example: 15, description: 'Invite id' })
  @ApiResponse({ status: 201, description: 'Workspace invite declined successfully.' })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED'" })
  @ApiResponse({ status: 404, description: "code: 'INVITE_NOT_FOUND'" })
  @ApiResponse({ status: 403, description: "code: 'INVITE_ACCESS_DENIED'" })
  @ApiResponse({ status: 409, description: "code: 'INVITE_ALREADY_PROCESSED'" })
  async declineInvite(
    @Param('inviteId', ParseIntPipe) inviteId: number,
    @Req() req: AuthedRequest,
  ): Promise<{ ok: boolean }> {
    return this.workspaceInviteService.declineInvite(inviteId, req.user.id);
  }

  @UseGuards(WorkspaceAccessGuard, WorkspaceRoleGuard)
  @WorkspaceRoles(WorkspaceRole.OWNER, WorkspaceRole.ADMIN)
  @Delete(':workspaceId/:inviteId')
  @ApiOperation({ summary: 'Delete workspace invite' })
  @ApiParam({ name: 'workspaceId', example: 1, description: 'Workspace id' })
  @ApiParam({ name: 'inviteId', example: 15, description: 'Invite id' })
  @ApiResponse({ status: 200, description: 'Workspace invite deleted successfully.' })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED'" })
  @ApiResponse({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'WORKSPACE_ACTION_FORBIDDEN' | code: 'RESOURCE_WORKSPACE_MISMATCH'" })
  @ApiResponse({ status: 404, description: "code: 'INVITE_NOT_FOUND'" })
  async deleteInvite(
    @Req() req: AuthedRequest,
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Param('inviteId', ParseIntPipe) inviteId: number,
  ): Promise<{ ok: boolean }> {
    return this.workspaceInviteService.deleteInvite(
      inviteId,
      workspaceId,
      req.user.id,
    );
  }
}
