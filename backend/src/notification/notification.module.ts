import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { DeadlineReminderCronService } from './deadline-reminder.cron';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationController],
  providers: [NotificationService, DeadlineReminderCronService],
  exports: [NotificationService],
})
export class NotificationModule {}
