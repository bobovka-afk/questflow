import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { WorkspaceAccessGuard } from '../common/guards/workspace-access.guard';
import { WorkspaceResourceGuard } from '../common/guards/workspace-resource.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment-dto';
import { RateLimit } from '../common/decorators/rate-limit.decorator';
import { RateLimitGuard } from '../common/guards/rate-limit.guard';
import {
  ApiBody,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { CommentWithUser } from './interface';
import type { AuthedRequest, WorkspaceAuthedRequest } from '../common/type';

@ApiTags('comment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, WorkspaceAccessGuard, WorkspaceResourceGuard)
@Controller('workspace/:workspaceId')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('cards/:cardId/comments')
  @ApiOperation({ summary: 'Get comments for a card' })
  @ApiParam({ name: 'workspaceId', example: 1, description: 'Workspace id' })
  @ApiParam({ name: 'cardId', example: 35, description: 'Card id' })
  @ApiResponse({ status: 200, description: 'Comments returned successfully.' })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED'" })
  @ApiResponse({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'WORKSPACE_ACTION_FORBIDDEN' | code: 'RESOURCE_WORKSPACE_MISMATCH'" })
  async getComments(
    @Param('cardId', ParseIntPipe) cardId: number,
  ): Promise<CommentWithUser[]> {
    return this.commentService.getComments(cardId);
  }

  @Post('cards/:cardId/comments')
  @UseGuards(RateLimitGuard)
  @RateLimit({ key: 'comment:create', limit: 20, windowSec: 60 })
  @ApiOperation({ summary: 'Create comment for a card' })
  @ApiBody({ type: CreateCommentDto, description: 'Comment creation payload' })
  @ApiParam({ name: 'workspaceId', example: 1, description: 'Workspace id' })
  @ApiParam({ name: 'cardId', example: 35, description: 'Card id' })
  @ApiResponse({ status: 201, description: 'Comment created successfully.' })
  @ApiResponse({ status: 400, description: "code: 'CARD_ID_REQUIRED' | code: 'WORKSPACE_ID_REQUIRED'" })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED'" })
  @ApiResponse({ status: 429, description: "code: 'RATE_LIMIT_EXCEEDED'" })
  async createComment(
    @Param('cardId', ParseIntPipe) cardId: number,
    @Body() dto: CreateCommentDto,
    @Req() req: AuthedRequest,
  ): Promise<CommentWithUser> {
    return this.commentService.createComment(cardId, req.user.id, dto);
  }

  @Patch('comments/:commentId')
  @ApiOperation({ summary: 'Update comment' })
  @ApiBody({ type: UpdateCommentDto, description: 'Comment update payload' })
  @ApiParam({ name: 'workspaceId', example: 1, description: 'Workspace id' })
  @ApiParam({ name: 'commentId', example: 52, description: 'Comment id' })
  @ApiResponse({ status: 200, description: 'Comment updated successfully.' })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED'" })
  @ApiResponse({ status: 403, description: "code: 'COMMENT_EDIT_FORBIDDEN' | code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'RESOURCE_WORKSPACE_MISMATCH'" })
  @ApiResponse({ status: 404, description: "code: 'COMMENT_NOT_FOUND'" })
  async updateComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() dto: UpdateCommentDto,
    @Req() req: AuthedRequest,
  ): Promise<CommentWithUser> {
    return this.commentService.updateComment(commentId, req.user.id, dto);
  }

  @Delete('comments/:commentId')
  @ApiOperation({ summary: 'Delete comment' })
  @ApiParam({ name: 'workspaceId', example: 1, description: 'Workspace id' })
  @ApiParam({ name: 'commentId', example: 52, description: 'Comment id' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully.' })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED'" })
  @ApiResponse({ status: 403, description: "code: 'COMMENT_DELETE_FORBIDDEN' | code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'WORKSPACE_ACTION_FORBIDDEN'" })
  @ApiResponse({ status: 404, description: "code: 'COMMENT_NOT_FOUND'" })
  async deleteComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Req() req: WorkspaceAuthedRequest,
  ): Promise<{ ok: boolean }> {
    return this.commentService.deleteComment(
      commentId,
      req.user.id,
      req.workspaceId,
    );
  }
}
