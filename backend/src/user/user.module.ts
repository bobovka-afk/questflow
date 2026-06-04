import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { RateLimitGuard } from '../common/guards/rate-limit.guard';
import { UserSettingsModule } from '../user-settings/user-settings.module';
import { MailModule } from '../mail/mail.module';
import { UserEmailChangeService } from './user-email-change.service';
import { UserBlockService } from './user-block.service';
import { UserPublicController } from './user-public.controller';

@Module({
  imports: [PrismaModule, RedisModule, UserSettingsModule, MailModule],
  controllers: [UserController, UserPublicController],
  providers: [UserService, UserEmailChangeService, UserBlockService, RateLimitGuard],
  exports: [UserService, UserEmailChangeService, UserBlockService],
})
export class UserModule {}
