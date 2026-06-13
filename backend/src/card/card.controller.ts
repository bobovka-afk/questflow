import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { UPLOAD_DIRS, ensureUploadDir } from '../uploads/local-uploads';
import type { File as MulterFile } from 'multer';
import { CardService } from './card.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { WorkspaceAccessGuard } from '../common/guards/workspace-access.guard';
import { WorkspaceResourceGuard } from '../common/guards/workspace-resource.guard';
import { CreateCardDto } from './dto/create-card.dto';
import { MoveCardDto } from './dto/move-card.dto';
import { SetCardCompletionDto } from './dto/set-card-completion.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { SetCardLabelsDto } from './dto/set-card-labels.dto';
import { WorkspaceLabelService } from '../workspace/workspace-label.service';
import { CardAttachmentService } from './card-attachment.service';
import { AddCardAttachmentLinkDto } from './dto/add-card-attachment-link.dto';
import { SetCardCoverDto } from './dto/set-card-cover.dto';
import { CARD_ATTACHMENT_MAX_BYTES } from './config/card-attachment-limits';
import type { CardAttachmentView } from './interface/card-attachment.interface';
import {
  ApiBody,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { AuthedRequest } from '../common/type';
import type { Card } from '../generated/prisma/client';

@ApiTags('card')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, WorkspaceAccessGuard, WorkspaceResourceGuard)
@Controller('workspace/:workspaceId')
export class CardController {
  constructor(
    private readonly cardService: CardService,
    private readonly labelService: WorkspaceLabelService,
    private readonly cardAttachmentService: CardAttachmentService,
  ) {}

  @Get('lists/:listId/cards')
  @ApiOperation({ summary: 'Get cards for a list' })
  @ApiParam({ name: 'workspaceId', example: 1, description: 'Workspace id' })
  @ApiParam({ name: 'listId', example: 11, description: 'List id' })
  @ApiResponse({ status: 200, description: 'Cards returned successfully.' })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED'" })
  @ApiResponse({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'WORKSPACE_ACTION_FORBIDDEN' | code: 'RESOURCE_WORKSPACE_MISMATCH'" })
  async getCards(
    @Param('listId', ParseIntPipe) listId: number,
  ): Promise<Card[]> {
    return this.cardService.getCards(listId);
  }


  @Post('lists/:listId/cards')
  @ApiOperation({ summary: 'Create card' })
  @ApiBody({ type: CreateCardDto, description: 'Card creation payload' })
  @ApiParam({ name: 'workspaceId', example: 1, description: 'Workspace id' })
  @ApiParam({ name: 'listId', example: 11, description: 'List id' })
  @ApiResponse({ status: 201, description: 'Card created successfully.' })
  @ApiResponse({ status: 400, description: "code: 'LIST_ID_REQUIRED' | code: 'WORKSPACE_ID_REQUIRED'" })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED'" })
  async createCard(
    @Param('listId', ParseIntPipe) listId: number,
    @Body() dto: CreateCardDto,
  ): Promise<Card> {
    return this.cardService.createCard(listId, dto);
  }


  @Patch('cards/:cardId/move')
  @ApiOperation({ summary: 'Move card to another list or position' })
  @ApiBody({ type: MoveCardDto, description: 'Card move payload' })
  @ApiParam({ name: 'workspaceId', example: 1, description: 'Workspace id' })
  @ApiParam({ name: 'cardId', example: 35, description: 'Card id' })
  @ApiResponse({ status: 200, description: 'Card moved successfully.' })
  @ApiResponse({ status: 400, description: "code: 'CARD_MOVE_CROSS_BOARD' | code: 'CARD_ID_REQUIRED'" })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED'" })
  @ApiResponse({ status: 404, description: "code: 'CARD_NOT_FOUND' | code: 'LIST_NOT_FOUND'" })
  async moveCard(
    @Param('cardId', ParseIntPipe) cardId: number,
    @Body() dto: MoveCardDto,
  ): Promise<Card | null> {
    return this.cardService.moveCard(cardId, dto);
  }

  @Patch('cards/:cardId/completion')
  @ApiOperation({ summary: 'Set card completion state' })
  @ApiBody({ type: SetCardCompletionDto, description: 'Card completion payload' })
  @ApiParam({ name: 'workspaceId', example: 1, description: 'Workspace id' })
  @ApiParam({ name: 'cardId', example: 35, description: 'Card id' })
  @ApiResponse({ status: 200, description: 'Card completion state updated successfully.' })
  @ApiResponse({ status: 400, description: "code: 'CARD_ID_REQUIRED'" })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED'" })
  @ApiResponse({ status: 404, description: "code: 'CARD_NOT_FOUND'" })
  async setCardCompletion(
    @Req() req: AuthedRequest,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Body() dto: SetCardCompletionDto,
  ): Promise<{ ok: boolean }> {
    return this.cardService.setCardCompletion(
      cardId,
      dto,
      req.user.id,
    );
  }

  @Patch('cards/:cardId')
  @ApiOperation({ summary: 'Update card' })
  @ApiBody({ type: UpdateCardDto, description: 'Card update payload' })
  @ApiParam({ name: 'workspaceId', example: 1, description: 'Workspace id' })
  @ApiParam({ name: 'cardId', example: 35, description: 'Card id' })
  @ApiResponse({ status: 200, description: 'Card updated successfully.' })
  @ApiResponse({ status: 400, description: "code: 'CARD_UPDATE_FIELDS_REQUIRED' | code: 'CARD_ID_REQUIRED'" })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED'" })
  @ApiResponse({ status: 404, description: "code: 'CARD_NOT_FOUND'" })
  async updateCard(
    @Req() req: AuthedRequest,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Body() dto: UpdateCardDto,
  ): Promise<Card> {
    return this.cardService.updateCard(cardId, dto, req.user.id);
  }

  @Patch('cards/:cardId/labels')
  @ApiOperation({ summary: 'Set labels on card' })
  async setCardLabels(
    @Param('cardId', ParseIntPipe) cardId: number,
    @Body() dto: SetCardLabelsDto,
  ): Promise<{ ok: boolean }> {
    await this.labelService.setCardLabels(cardId, dto.labelIds);
    return { ok: true };
  }

  @Get('cards/:cardId/attachments')
  @ApiOperation({ summary: 'List card attachments' })
  async listAttachments(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Param('cardId', ParseIntPipe) cardId: number,
  ): Promise<CardAttachmentView[]> {
    return this.cardAttachmentService.listForCard(cardId, workspaceId);
  }

  @Post('cards/:cardId/attachments')
  @ApiOperation({ summary: 'Upload file attachment (max 10 MB, no video)' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          cb(null, ensureUploadDir(UPLOAD_DIRS.cardAttachments));
        },
        filename: (req, _file, cb) => {
          const cardId = (req as { params?: { cardId?: string } }).params?.cardId ?? 'tmp';
          cb(null, `${cardId}-${Date.now()}-${randomUUID()}.upload`);
        },
      }),
      limits: { fileSize: CARD_ATTACHMENT_MAX_BYTES },
    }),
  )
  async uploadAttachment(
    @Req() req: AuthedRequest,
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Param('cardId', ParseIntPipe) cardId: number,
    @UploadedFile() file?: MulterFile,
  ): Promise<CardAttachmentView> {
    return this.cardAttachmentService.uploadFile(
      cardId,
      workspaceId,
      req.user.id,
      file as MulterFile,
    );
  }

  @Post('cards/:cardId/attachments/link')
  @ApiOperation({ summary: 'Attach URL (videos as links only)' })
  async addAttachmentLink(
    @Req() req: AuthedRequest,
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Body() body: AddCardAttachmentLinkDto,
  ): Promise<CardAttachmentView> {
    return this.cardAttachmentService.addLink(
      cardId,
      workspaceId,
      req.user.id,
      body.url,
      body.fileName,
    );
  }

  @Delete('cards/:cardId/attachments/:attachmentId')
  @ApiOperation({ summary: 'Delete card attachment' })
  async deleteAttachment(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Param('attachmentId', ParseIntPipe) attachmentId: number,
  ): Promise<{ ok: boolean }> {
    await this.cardAttachmentService.deleteAttachment(
      cardId,
      workspaceId,
      attachmentId,
    );
    return { ok: true };
  }

  @Patch('cards/:cardId/cover')
  @ApiOperation({ summary: 'Set or clear card cover image' })
  async setCardCover(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Body() body: SetCardCoverDto,
  ): Promise<{ ok: boolean }> {
    const id =
      body.attachmentId === undefined ? null : body.attachmentId;
    if (id != null && typeof id !== 'number') {
      throw new BadRequestException({
        code: 'INVALID_COVER',
        message: 'Invalid cover attachment id',
      });
    }
    await this.cardAttachmentService.setCover(cardId, workspaceId, id);
    return { ok: true };
  }

  @Delete('cards/:cardId')
  @ApiOperation({ summary: 'Delete card' })
  @ApiParam({ name: 'workspaceId', example: 1, description: 'Workspace id' })
  @ApiParam({ name: 'cardId', example: 35, description: 'Card id' })
  @ApiResponse({ status: 200, description: 'Card deleted successfully.' })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED'" })
  @ApiResponse({ status: 404, description: "code: 'CARD_NOT_FOUND'" })
  async deleteCard(
    @Param('cardId', ParseIntPipe) cardId: number,
  ): Promise<{ ok: boolean }> {
    return this.cardService.deleteCard(cardId);
  }
}
