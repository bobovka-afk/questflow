import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { RateLimitGuard } from '../common/guards/rate-limit.guard';
import { SocialService } from './social.service';
import { SocialController } from './social.controller';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [SocialController],
  providers: [SocialService, RateLimitGuard],
  exports: [SocialService],
})
export class SocialModule {}
