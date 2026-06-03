import { Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { UserNotificationType } from '../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';

export type NotificationListItem = {
  id: number;
  type: UserNotificationType;
  payload: Prisma.JsonValue;
  readAt: Date | null;
  createdAt: Date;
};

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: number,
    type: UserNotificationType,
    payload: Prisma.InputJsonValue,
  ): Promise<void> {
    await this.prisma.userNotification.create({
      data: { userId, type, payload },
    });
  }

  async listForUser(
    userId: number,
    limit: number,
    offset: number,
  ): Promise<NotificationListItem[]> {
    return this.prisma.userNotification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      select: {
        id: true,
        type: true,
        payload: true,
        readAt: true,
        createdAt: true,
      },
    });
  }

  async unreadCount(userId: number): Promise<number> {
    return this.prisma.userNotification.count({
      where: { userId, readAt: null },
    });
  }

  async markRead(userId: number, notificationId: number): Promise<void> {
    await this.prisma.userNotification.updateMany({
      where: { id: notificationId, userId },
      data: { readAt: new Date() },
    });
  }

  async markAllRead(userId: number): Promise<void> {
    await this.prisma.userNotification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
  }
}
