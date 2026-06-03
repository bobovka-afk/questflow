import { Controller } from '@nestjs/common';
import { BoardService } from './board.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import {
  Post,
  Body,
  Get,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  Query,
  ParseBoolPipe,
} from '@nestjs/common';
import { WorkspaceAccessGuard } from '../common/guards/workspace-access.guard';
import { WorkspacePermissionGuard } from '../common/guards/workspace-permission.guard';
import { WorkspaceResourceGuard } from '../common/guards/workspace-resource.guard';
import { WorkspacePermission } from '../common/decorators/workspace-permission.decorator';
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
import type { Board } from '../generated/prisma/client';

@ApiTags('board')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, WorkspaceAccessGuard, WorkspaceResourceGuard)
@Controller('workspace/:workspaceId')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @UseGuards(WorkspacePermissionGuard)
  @WorkspacePermission('manageBoards')
  @Post('boards')
  @ApiOperation({ summary: 'Create board' })
  @ApiBody({ type: CreateBoardDto, description: 'Board creation payload' })
  @ApiParam({ name: 'workspaceId', example: 1, description: 'Workspace id' })
  @ApiResponse({ status: 201, description: 'Board created successfully.' })
  async createBoard(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Body() dto: CreateBoardDto,
  ): Promise<Board> {
    return this.boardService.createBoard(workspaceId, dto);
  }

  @Get('boards')
  @ApiOperation({ summary: 'Get workspace boards' })
  @ApiQuery({ name: 'includeArchived', required: false, type: Boolean })
  async getBoards(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Query('includeArchived', new ParseBoolPipe({ optional: true }))
    includeArchived?: boolean,
  ): Promise<Board[]> {
    return this.boardService.getBoards(workspaceId, includeArchived === true);
  }

  @UseGuards(WorkspaceRoleGuard)
  @WorkspaceRoles(WorkspaceRole.OWNER, WorkspaceRole.ADMIN)
  @Get('boards/archived/list')
  @ApiOperation({ summary: 'List archived boards (owner/admin)' })
  async getArchivedBoards(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
  ): Promise<Board[]> {
    return this.boardService.getArchivedBoards(workspaceId);
  }

  @Get('boards/:boardId')
  @ApiOperation({ summary: 'Get board details' })
  async getBoard(@Param('boardId', ParseIntPipe) boardId): Promise<Board> {
    return this.boardService.getBoard(boardId);
  }

  @UseGuards(WorkspacePermissionGuard)
  @WorkspacePermission('manageBoards')
  @Patch('boards/:boardId')
  @ApiOperation({ summary: 'Update board' })
  async updateBoard(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() dto: UpdateBoardDto,
  ): Promise<Board> {
    return this.boardService.updateBoard(boardId, dto);
  }

  @UseGuards(WorkspacePermissionGuard)
  @WorkspacePermission('archiveBoards')
  @Patch('boards/:boardId/archive')
  @ApiOperation({ summary: 'Archive board' })
  async archiveBoard(
    @Param('boardId', ParseIntPipe) boardId: number,
  ): Promise<Board> {
    return this.boardService.updateBoard(boardId, { archived: true });
  }

  @UseGuards(WorkspacePermissionGuard)
  @WorkspacePermission('archiveBoards')
  @Patch('boards/:boardId/unarchive')
  @ApiOperation({ summary: 'Restore archived board' })
  async unarchiveBoard(
    @Param('boardId', ParseIntPipe) boardId: number,
  ): Promise<Board> {
    return this.boardService.updateBoard(boardId, { archived: false });
  }

  @UseGuards(WorkspacePermissionGuard)
  @WorkspacePermission('manageBoards')
  @Delete('boards/:boardId')
  @ApiOperation({ summary: 'Delete board' })
  async deleteBoard(
    @Param('boardId', ParseIntPipe) boardId: number,
  ): Promise<{ ok: boolean }> {
    return this.boardService.deleteBoard(boardId);
  }
}
