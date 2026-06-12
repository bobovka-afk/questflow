import {
  Controller,
  Post,
  Req,
  Body,
  Query,
  Get,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { ReorderUserWorkspaceDto } from './dto/reorder-user-workspace.dto';
import { WorkspaceAccessGuard } from '../common/guards/workspace-access.guard';
import { WorkspaceRoleGuard } from '../common/guards/workspace-role.guard';
import { WorkspaceRoles } from '../common/decorators/workspace-roles.decorator';
import { WorkspaceRole } from '../generated/prisma/enums';
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
  UserWorkspaceRow,
  WorkspaceCreated,
  WorkspaceSummary,
  WorkspaceUpdated,
} from './interface';
import type { AuthedRequest } from '../common/type';

@ApiTags('workspace')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a workspace' })
  @ApiBody({ type: CreateWorkspaceDto, description: 'Workspace creation payload' })
  @ApiResponse({ status: 201, description: 'Workspace created successfully.' })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED'" })
  async createWorkspace(
    @Req() req: AuthedRequest,
    @Body() dto: CreateWorkspaceDto,
  ): Promise<WorkspaceCreated> {
      return this.workspaceService.createWorkspace(dto, req.user.id);
    }

  @Get('get-user-workspaces')
  @ApiOperation({ summary: 'Get workspaces for current user' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Maximum number of records to return' })
  @ApiQuery({ name: 'offset', required: false, example: 0, description: 'Number of records to skip' })
  @ApiResponse({ status: 200, description: 'User workspaces returned successfully.' })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED'" })
  async getUserWorkspaces(
    @Req() req: AuthedRequest,
    @Query() paginationDto: PaginationDto,
  ): Promise<UserWorkspaceRow[]> {
    return this.workspaceService.getUserWorkspaces(req.user.id, paginationDto);
  }

  @Patch('reorder-user-workspace')
  @ApiOperation({ summary: 'Reorder a workspace in the current user list' })
  @ApiBody({ type: ReorderUserWorkspaceDto })
  @ApiResponse({ status: 200, description: 'Workspace order updated.' })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED'" })
  @ApiResponse({ status: 404, description: "code: 'WORKSPACE_MEMBER_NOT_FOUND'" })
  async reorderUserWorkspace(
    @Req() req: AuthedRequest,
    @Body() dto: ReorderUserWorkspaceDto,
  ): Promise<{ ok: boolean }> {
    return this.workspaceService.reorderUserWorkspace(req.user.id, dto);
  }

  @UseGuards(WorkspaceAccessGuard)
  @Get(':workspaceId/summary')
  @ApiOperation({ summary: 'Get workspace summary' })
  @ApiParam({ name: 'workspaceId', example: 1, description: 'Workspace id' })
  @ApiResponse({ status: 200, description: 'Workspace summary returned successfully.' })
  @ApiResponse({ status: 400, description: "code: 'WORKSPACE_ID_REQUIRED'" })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED'" })
  @ApiResponse({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED'" })
  @ApiResponse({ status: 404, description: "code: 'WORKSPACE_NOT_FOUND'" })
  async getWorkspaceSummary(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Req() req: AuthedRequest,
  ): Promise<WorkspaceSummary> {
    return this.workspaceService.getWorkspaceSummary(
      workspaceId,
      req.user.id,
    );
  }

  @UseGuards(WorkspaceAccessGuard, WorkspaceRoleGuard)
  @WorkspaceRoles(WorkspaceRole.OWNER, WorkspaceRole.ADMIN)
  @Patch(':workspaceId')
  @ApiOperation({ summary: 'Update workspace' })
  @ApiBody({ type: UpdateWorkspaceDto, description: 'Workspace update payload' })
  @ApiParam({ name: 'workspaceId', example: 1, description: 'Workspace id' })
  @ApiResponse({ status: 200, description: 'Workspace updated successfully.' })
  @ApiResponse({ status: 400, description: "code: 'WORKSPACE_UPDATE_FIELDS_REQUIRED' | code: 'WORKSPACE_ID_REQUIRED'" })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED'" })
  @ApiResponse({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'WORKSPACE_ACTION_FORBIDDEN'" })
  @ApiResponse({ status: 404, description: "code: 'WORKSPACE_NOT_FOUND'" })
  async updateWorkspace(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Body() dto: UpdateWorkspaceDto,
    @Req() req: AuthedRequest,
  ): Promise<WorkspaceUpdated> {
    return this.workspaceService.updateWorkspace(
      workspaceId,
      dto,
      req.user.id,
    );
  }

  @UseGuards(WorkspaceAccessGuard, WorkspaceRoleGuard)
  @WorkspaceRoles(WorkspaceRole.OWNER)
  @Delete(':workspaceId')
  @ApiOperation({ summary: 'Delete workspace' })
  @ApiParam({ name: 'workspaceId', example: 1, description: 'Workspace id' })
  @ApiResponse({ status: 200, description: 'Workspace deleted successfully.' })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED'" })
  @ApiResponse({ status: 400, description: "code: 'WORKSPACE_ID_REQUIRED'" })
  @ApiResponse({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'WORKSPACE_ACTION_FORBIDDEN'" })
  @ApiResponse({ status: 404, description: "code: 'WORKSPACE_NOT_FOUND'" })
  async deleteWorkspace(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
  ): Promise<{ ok: boolean }> {
    return this.workspaceService.deleteWorkspace(workspaceId);
  }

}
