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
