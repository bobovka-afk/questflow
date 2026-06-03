import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { WorkspaceAccessGuard } from '../common/guards/workspace-access.guard';
import { WorkspacePermissionGuard } from '../common/guards/workspace-permission.guard';
import { WorkspacePermission } from '../common/decorators/workspace-permission.decorator';
import { WorkspaceSearchQueryDto } from './dto/workspace-search-query.dto';
import { CreateWorkspaceLabelDto } from './dto/create-workspace-label.dto';
import { UpdateWorkspaceLabelDto } from './dto/update-workspace-label.dto';
import { WorkspaceSearchService } from './workspace-search.service';
import { WorkspaceLabelService } from './workspace-label.service';

@ApiTags('workspace-features')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, WorkspaceAccessGuard)
@Controller('workspace/:workspaceId')
export class WorkspaceFeaturesController {
  constructor(
    private readonly searchService: WorkspaceSearchService,
    private readonly labelService: WorkspaceLabelService,
  ) {}

  @Get('search')
  @ApiOperation({ summary: 'Search cards in workspace (Trello-style)' })
  async search(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Query() query: WorkspaceSearchQueryDto,
  ) {
    return this.searchService.search(workspaceId, query.q, {
      boardId: query.boardId,
      listId: query.listId,
      assigneeId: query.assigneeId,
    });
  }

  @Get('labels')
  @ApiOperation({ summary: 'List workspace labels' })
  async listLabels(@Param('workspaceId', ParseIntPipe) workspaceId: number) {
    return this.labelService.list(workspaceId);
  }

  @UseGuards(WorkspacePermissionGuard)
  @WorkspacePermission('manageLabels')
  @Post('labels')
  @ApiOperation({ summary: 'Create workspace label' })
  async createLabel(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Body() dto: CreateWorkspaceLabelDto,
  ) {
    return this.labelService.create(workspaceId, dto);
  }

  @UseGuards(WorkspacePermissionGuard)
  @WorkspacePermission('manageLabels')
  @Patch('labels/:labelId')
  @ApiOperation({ summary: 'Update workspace label' })
  async updateLabel(
    @Param('labelId', ParseIntPipe) labelId: number,
    @Body() dto: UpdateWorkspaceLabelDto,
  ) {
    return this.labelService.update(labelId, dto);
  }

  @UseGuards(WorkspacePermissionGuard)
  @WorkspacePermission('manageLabels')
  @Delete('labels/:labelId')
  @ApiOperation({ summary: 'Delete workspace label' })
  async deleteLabel(@Param('labelId', ParseIntPipe) labelId: number) {
    return this.labelService.delete(labelId);
  }
}
