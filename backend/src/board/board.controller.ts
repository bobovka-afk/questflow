import { Controller } from '@nestjs/common';
import { BoardService } from './board.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Post, Body, Get, Patch, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { WorkspaceAccessGuard } from '../common/guards/workspace-access.guard';
import { WorkspaceRoleGuard } from '../common/guards/workspace-role.guard';
import { WorkspaceResourceGuard } from '../common/guards/workspace-resource.guard';
import { WorkspaceRoles } from '../common/decorators/workspace-roles.decorator';
import { WorkspaceRole } from '../generated/prisma/enums';
import {
  ApiBody,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Board } from '../generated/prisma/client';

@ApiTags('board')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, WorkspaceAccessGuard, WorkspaceResourceGuard)
@Controller('workspace/:workspaceId')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @UseGuards(WorkspaceRoleGuard)
  @WorkspaceRoles(WorkspaceRole.OWNER, WorkspaceRole.ADMIN)
  @Post('boards')
  @ApiOperation({ summary: 'Create board' })
  @ApiBody({ type: CreateBoardDto, description: 'Board creation payload' })
  @ApiParam({ name: 'workspaceId', example: 1, description: 'Workspace id' })
  @ApiResponse({ status: 201, description: 'Board created successfully.' })
  @ApiResponse({ status: 400, description: "code: 'WORKSPACE_ID_REQUIRED'" })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED'" })
  @ApiResponse({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'WORKSPACE_ACTION_FORBIDDEN' | code: 'RESOURCE_WORKSPACE_MISMATCH'" })
  async createBoard(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Body() dto: CreateBoardDto,
  ): Promise<Board> {
    return this.boardService.createBoard(workspaceId, dto);
  }

  @Get('boards/:boardId')
  @ApiOperation({ summary: 'Get board details' })
  @ApiParam({ name: 'workspaceId', example: 1, description: 'Workspace id' })
  @ApiParam({ name: 'boardId', example: 7, description: 'Board id' })
  @ApiResponse({ status: 200, description: 'Board details returned successfully.' })
  @ApiResponse({ status: 400, description: "code: 'BOARD_ID_REQUIRED' | code: 'WORKSPACE_ID_REQUIRED'" })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED'" })
  @ApiResponse({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'RESOURCE_WORKSPACE_MISMATCH'" })
  @ApiResponse({ status: 404, description: "code: 'BOARD_NOT_FOUND' | code: 'WORKSPACE_NOT_FOUND'" })
  async getBoard(
    @Param('boardId', ParseIntPipe) boardId,
  ): Promise<Board> {
    return this.boardService.getBoard(boardId);
  }

  @Get('boards')
  @ApiOperation({ summary: 'Get workspace boards' })
  @ApiParam({ name: 'workspaceId', example: 1, description: 'Workspace id' })
  @ApiResponse({ status: 200, description: 'Workspace boards returned successfully.' })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED'" })
  @ApiResponse({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'WORKSPACE_ACTION_FORBIDDEN' | code: 'RESOURCE_WORKSPACE_MISMATCH'" })
  async getBoards(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
  ): Promise<Board[]> {
    return this.boardService.getBoards(workspaceId);
  }

  @UseGuards(WorkspaceRoleGuard)
  @WorkspaceRoles(WorkspaceRole.OWNER, WorkspaceRole.ADMIN)
  @Patch('boards/:boardId')
  @ApiOperation({ summary: 'Update board' })
  @ApiBody({ type: UpdateBoardDto, description: 'Board update payload' })
  @ApiParam({ name: 'workspaceId', example: 1, description: 'Workspace id' })
  @ApiParam({ name: 'boardId', example: 7, description: 'Board id' })
  @ApiResponse({ status: 200, description: 'Board updated successfully.' })
  @ApiResponse({ status: 400, description: "code: 'BOARD_UPDATE_FIELDS_REQUIRED' | code: 'BOARD_ID_REQUIRED' | code: 'WORKSPACE_ID_REQUIRED'" })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED'" })
  @ApiResponse({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'WORKSPACE_ACTION_FORBIDDEN' | code: 'RESOURCE_WORKSPACE_MISMATCH'" })
  @ApiResponse({ status: 404, description: "code: 'BOARD_NOT_FOUND'" })
  async updateBoard(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() dto: UpdateBoardDto,
  ): Promise<Board> {
    return this.boardService.updateBoard(
      boardId,
      dto,
    );
  }

  @UseGuards(WorkspaceRoleGuard)
  @WorkspaceRoles(WorkspaceRole.OWNER, WorkspaceRole.ADMIN)
  @Delete('boards/:boardId')
  @ApiOperation({ summary: 'Delete board' })
  @ApiParam({ name: 'workspaceId', example: 1, description: 'Workspace id' })
  @ApiParam({ name: 'boardId', example: 7, description: 'Board id' })
  @ApiResponse({ status: 200, description: 'Board deleted successfully.' })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED'" })
  @ApiResponse({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'WORKSPACE_ACTION_FORBIDDEN' | code: 'RESOURCE_WORKSPACE_MISMATCH'" })
  @ApiResponse({ status: 404, description: "code: 'BOARD_NOT_FOUND'" })
  async deleteBoard(
    @Param('boardId', ParseIntPipe) boardId: number,
  ): Promise<{ ok: boolean }> {
    return this.boardService.deleteBoard(boardId);
  }

}
