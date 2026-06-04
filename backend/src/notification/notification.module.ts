import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { DeadlineReminderCronService } from './deadline-reminder.cron';
import { WebPushService } from './web-push.service';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [NotificationController],
  providers: [NotificationService, WebPushService, DeadlineReminderCronService],
  exports: [NotificationService, WebPushService],
})
export class NotificationModule {}
