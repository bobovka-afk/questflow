import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { WorkspaceModule } from '../workspace/workspace.module';
import { RedisModule } from '../redis/redis.module';
import { RateLimitGuard } from '../common/guards/rate-limit.guard';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    PrismaModule,
    WorkspaceModule,
    RedisModule,
    NotificationModule,
  ],
  controllers: [CommentController],
  providers: [CommentService, RateLimitGuard],
})
export class CommentModule {}
