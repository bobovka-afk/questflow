import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { PrismaService } from '../prisma/prisma.service';
import { UserNotificationType } from '../generated/prisma/enums';
import { NotificationService } from './notification.service';

export const DEADLINE_REMINDER_CRON_NAME = 'cardDeadlineReminders';
/** Every 5 minutes */
export const DEADLINE_REMINDER_CRON_EXPRESSION = '*/5 * * * *';

@Injectable()
export class DeadlineReminderCronService implements OnModuleInit {
  private readonly logger = new Logger(DeadlineReminderCronService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  onModuleInit(): void {
    const job = new CronJob(
      DEADLINE_REMINDER_CRON_EXPRESSION,
      () => {
        void this.runDeadlineReminders();
      },
      null,
      true,
      'UTC',
    );
    this.schedulerRegistry.addCronJob(DEADLINE_REMINDER_CRON_NAME, job);
    job.start();
  }

  async runDeadlineReminders(): Promise<void> {
    const now = new Date();
    const cards = await this.prisma.card.findMany({
      where: {
        isCompleted: false,
        dueDate: { not: null },
        reminderMinutesBefore: { not: null },
        reminderNotifiedAt: null,
        list: {
          archivedAt: null,
          board: { archivedAt: null },
        },
      },
      select: {
        id: true,
        title: true,
        dueDate: true,
        reminderMinutesBefore: true,
        assigneeId: true,
        list: {
          select: {
            board: {
              select: { id: true, name: true, workspaceId: true },
            },
          },
        },
      },
    });

    for (const card of cards) {
      const due = card.dueDate!;
      const minutes = card.reminderMinutesBefore!;
      const notifyAt = new Date(due.getTime() - minutes * 60_000);
      if (now < notifyAt) continue;

      const recipientId = card.assigneeId;
      if (!recipientId) continue;

      const board = card.list.board;
      await this.notificationService.create(recipientId, UserNotificationType.DEADLINE, {
        cardId: card.id,
        cardTitle: card.title,
        dueDate: due.toISOString(),
        boardId: board.id,
        boardName: board.name,
        workspaceId: board.workspaceId,
      });

      await this.prisma.card.update({
        where: { id: card.id },
        data: { reminderNotifiedAt: now },
      });
    }

    this.logger.debug(`Deadline reminder pass done (${cards.length} candidates)`);
  }
}
