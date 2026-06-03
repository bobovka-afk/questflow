import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
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

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

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
