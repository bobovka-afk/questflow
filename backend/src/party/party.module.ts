import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { GamificationModule } from '../gamification/gamification.module';
import { RedisModule } from '../redis/redis.module';
import { RateLimitGuard } from '../common/guards/rate-limit.guard';
import { PartyService } from './party.service';
import { PartyController } from './party.controller';
import { NotificationModule } from '../notification/notification.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, GamificationModule, RedisModule, NotificationModule, UserModule],
  controllers: [PartyController],
  providers: [PartyService, RateLimitGuard],
  exports: [PartyService],
})
export class PartyModule {}
