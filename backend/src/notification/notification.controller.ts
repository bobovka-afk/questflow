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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import type { AuthedRequest } from '../common/type';
import { PaginationDto } from '../workspace/dto/pagination.dto';
import { NotificationService } from './notification.service';
import { WebPushService } from './web-push.service';

class PushSubscribeDto {
  endpoint!: string;
  keys!: { p256dh: string; auth: string };
}

class PushUnsubscribeDto {
  endpoint!: string;
}

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly webPushService: WebPushService,
  ) {}

  @Get('push/vapid-public-key')
  getVapidPublicKey() {
    return { publicKey: this.webPushService.getVapidPublicKey() };
  }

  @Post('push/subscribe')
  async subscribe(@Req() req: AuthedRequest, @Body() body: PushSubscribeDto) {
    await this.webPushService.subscribe(req.user.id, {
      endpoint: body.endpoint,
      keys: body.keys,
    });
    return { ok: true };
  }

  @Delete('push/subscribe')
  async unsubscribe(@Req() req: AuthedRequest, @Body() body: PushUnsubscribeDto) {
    await this.webPushService.unsubscribe(req.user.id, body.endpoint);
    return { ok: true };
  }

  @Get()
  @ApiOperation({ summary: 'List in-app notifications for current user' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  async list(@Req() req: AuthedRequest, @Query() pagination: PaginationDto) {
    return this.notificationService.listForUser(
      req.user.id,
      pagination.limit,
      pagination.offset,
    );
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Unread notification count' })
  async unreadCount(@Req() req: AuthedRequest) {
    const count = await this.notificationService.unreadCount(req.user.id);
    return { count };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiParam({ name: 'id', example: 1 })
  async markRead(
    @Req() req: AuthedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.notificationService.markRead(req.user.id, id);
    return { ok: true };
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllRead(@Req() req: AuthedRequest) {
    await this.notificationService.markAllRead(req.user.id);
    return { ok: true };
  }
}
