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
  Req,
  Sse,
  UseGuards,
  MessageEvent,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { SseAuthGuard } from '../common/guards/sse-auth.guard';
import { RateLimit } from '../common/decorators/rate-limit.decorator';
import { RateLimitGuard } from '../common/guards/rate-limit.guard';
import type { AuthedRequest } from '../common/type';
import { SocialService } from './social.service';
import { SendFriendRequestDto } from './dto/send-friend-request.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { MarkMessagesReadDto } from './dto/mark-messages-read.dto';

@ApiTags('social')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Get('me/code')
  @ApiOperation({ summary: 'Get own friend code (#1492)' })
  @ApiResponse({ status: 200, description: 'Friend code returned.' })
  @ApiResponse({ status: 404, description: "code: 'CHARACTER_NOT_FOUND'" })
  getMyCode(@Req() req: AuthedRequest) {
    return this.socialService.getMyFriendCode(req.user.id);
  }

  @Post('friends/request')
  @UseGuards(RateLimitGuard)
  @RateLimit({ key: 'social:friend-request', limit: 10, windowSec: 300 })
  @ApiOperation({ summary: 'Send friend request by friend code' })
  @ApiBody({ type: SendFriendRequestDto })
  @ApiResponse({ status: 201, description: 'Request created.' })
  @ApiResponse({ status: 404, description: "code: 'FRIEND_CODE_NOT_FOUND'" })
  @ApiResponse({ status: 409, description: "code: 'ALREADY_FRIENDS' | 'FRIEND_REQUEST_INCOMING_EXISTS'" })
  @ApiResponse({ status: 429, description: "code: 'RATE_LIMIT_EXCEEDED'" })
  sendFriendRequest(@Req() req: AuthedRequest, @Body() dto: SendFriendRequestDto) {
    return this.socialService.sendFriendRequest(req.user.id, dto.friendCode);
  }

  @Get('friends')
  @ApiOperation({ summary: 'List accepted friends' })
  listFriends(@Req() req: AuthedRequest) {
    return this.socialService.listFriends(req.user.id);
  }

  @Get('friends/search')
  @UseGuards(RateLimitGuard)
  @RateLimit({ key: 'social:friend-search', limit: 30, windowSec: 60 })
  @ApiQuery({ name: 'q', required: true })
  searchFriends(@Req() req: AuthedRequest, @Query('q') q: string) {
    return this.socialService.searchFriendsByCharacterName(req.user.id, q ?? '');
  }

  @Post('block/:userId')
  blockUser(
    @Req() req: AuthedRequest,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.socialService.blockUser(req.user.id, userId).then(() => ({ ok: true }));
  }

  @Delete('block/:userId')
  unblockUser(
    @Req() req: AuthedRequest,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.socialService.unblockUser(req.user.id, userId).then(() => ({ ok: true }));
  }

  @Get('friends/requests/incoming')
  listIncoming(@Req() req: AuthedRequest) {
    return this.socialService.listIncomingRequests(req.user.id);
  }

  @Get('friends/requests/outgoing')
  listOutgoing(@Req() req: AuthedRequest) {
    return this.socialService.listOutgoingRequests(req.user.id);
  }

  @Post('friends/requests/:id/accept')
  acceptRequest(
    @Req() req: AuthedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.socialService.acceptFriendRequest(req.user.id, id);
  }

  @Post('friends/requests/:id/decline')
  declineRequest(
    @Req() req: AuthedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.socialService.declineFriendRequest(req.user.id, id);
  }

  @Delete('friends/requests/:id')
  @ApiOperation({ summary: 'Cancel outgoing friend request' })
  @ApiResponse({ status: 404, description: "code: 'FRIEND_REQUEST_NOT_FOUND'" })
  async cancelRequest(
    @Req() req: AuthedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.socialService.cancelFriendRequest(req.user.id, id);
    return { ok: true };
  }

  @Get('inbox/summary')
  @ApiOperation({ summary: 'Unread messages and incoming friend requests counts' })
  getInboxSummary(@Req() req: AuthedRequest) {
    return this.socialService.getInboxSummary(req.user.id);
  }

  @Delete('friends/:userId')
  @ApiOperation({ summary: 'Remove friend' })
  async removeFriend(
    @Req() req: AuthedRequest,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    await this.socialService.removeFriend(req.user.id, userId);
    return { ok: true };
  }

  @Get('users/:userId/relation')
  @ApiOperation({ summary: 'Friend/message relation with another user' })
  getRelation(
    @Req() req: AuthedRequest,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.socialService.getUserRelation(req.user.id, userId);
  }

  @Get('messages/conversations')
  listConversations(@Req() req: AuthedRequest) {
    return this.socialService.listConversations(req.user.id);
  }

  @Get('messages/with/:userId/receipts')
  @ApiOperation({ summary: 'Read receipts for messages you sent in this dialog' })
  getSentReceipts(
    @Req() req: AuthedRequest,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.socialService.getSentMessageReceipts(req.user.id, userId);
  }

  @Sse('messages/stream/:userId')
  @UseGuards(SseAuthGuard)
  @ApiOperation({ summary: 'SSE stream of new DM messages (fallback: REST poll)' })
  streamMessages(
    @Req() req: AuthedRequest,
    @Param('userId', ParseIntPipe) peerUserId: number,
  ): Observable<MessageEvent> {
    return new Observable((subscriber) => {
      let lastId = 0;
      let closed = false;
      const tick = async () => {
        if (closed) return;
        try {
          const batch = await this.socialService.getMessagesWith(
            req.user.id,
            peerUserId,
            lastId > 0 ? lastId : undefined,
          );
          if (batch.length > 0) {
            lastId = Math.max(lastId, ...batch.map((m) => m.id));
            subscriber.next({ data: { messages: batch } });
          }
        } catch (err) {
          subscriber.error(err);
        }
      };
      const timer = setInterval(() => void tick(), 3000);
      void tick();
      return () => {
        closed = true;
        clearInterval(timer);
      };
    });
  }

  @Get('messages/with/:userId')
  @ApiQuery({ name: 'since', required: false, description: 'Message id — return only newer' })
  getMessages(
    @Req() req: AuthedRequest,
    @Param('userId', ParseIntPipe) userId: number,
    @Query('since') since?: string,
  ) {
    const sinceId =
      since != null && since !== '' ? Number(since) : undefined;
    if (since != null && since !== '' && !Number.isInteger(sinceId)) {
      return this.socialService.getMessagesWith(req.user.id, userId);
    }
    return this.socialService.getMessagesWith(req.user.id, userId, sinceId);
  }

  @Post('messages/with/:userId')
  @UseGuards(RateLimitGuard)
  @RateLimit({ key: 'social:message-send', limit: 30, windowSec: 60 })
  @ApiBody({ type: SendMessageDto })
  @ApiResponse({ status: 403, description: "code: 'MESSAGE_NOT_ALLOWED'" })
  @ApiResponse({ status: 429, description: "code: 'RATE_LIMIT_EXCEEDED'" })
  sendMessage(
    @Req() req: AuthedRequest,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: SendMessageDto,
  ) {
    return this.socialService.sendMessage(req.user.id, userId, dto.body);
  }

  @Patch('messages/read')
  @ApiBody({ type: MarkMessagesReadDto })
  markRead(@Req() req: AuthedRequest, @Body() dto: MarkMessagesReadDto) {
    return this.socialService.markMessagesRead(req.user.id, dto.userId);
  }
}
