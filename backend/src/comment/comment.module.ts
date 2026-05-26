import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { WorkspaceModule } from '../workspace/workspace.module';
import { RedisModule } from '../redis/redis.module';
import { RateLimitGuard } from '../common/guards/rate-limit.guard';
import { GamificationModule } from '../gamification/gamification.module';

@Module({
  imports: [PrismaModule, WorkspaceModule, RedisModule, GamificationModule],
  controllers: [CommentController],
  providers: [CommentService, RateLimitGuard],
})
export class CommentModule {}
