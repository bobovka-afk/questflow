import { Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { UserNotificationType } from '../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import {
  isInAppNotificationEnabled,
  mergeNotificationSettings,
} from './notification-preferences';
import { parseGamificationSettings } from '../user-settings/lib/settings-json';
import { WebPushService } from './web-push.service';

export type NotificationListItem = {
  id: number;
  type: UserNotificationType;
  payload: Prisma.JsonValue;
  readAt: Date | null;
  createdAt: Date;
};

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly webPushService: WebPushService,
  ) {}

  async create(
    userId: number,
    type: UserNotificationType,
    payload: Prisma.InputJsonValue,
  ): Promise<void> {
    const settings = await this.loadInAppSettings(userId);
    if (!isInAppNotificationEnabled(settings, type)) {
      return;
    }
    await this.prisma.userNotification.create({
      data: { userId, type, payload },
    });
    void this.webPushService.notifyUser(userId, type, this.pushPayloadFor(type, payload));
  }

  async notifyXpGain(
    userId: number,
    payload: { xpAmount: number; source?: string },
  ): Promise<void> {
    const row = await this.prisma.userSettings.findUnique({
      where: { userId },
      select: { site: true, gamification: true },
    });
    const gamification = parseGamificationSettings(row?.gamification);
    if (!gamification.xpGainNotifications) return;
    await this.create(userId, UserNotificationType.XP_GAIN, payload);
  }

  private pushPayloadFor(
    type: UserNotificationType,
    payload: Prisma.InputJsonValue,
  ): { title: string; body: string; url?: string } {
    const p = payload as Record<string, unknown>;
    if (type === UserNotificationType.CARD_ASSIGNED) {
      return {
        title: 'Назначение',
        body: `Вас назначили на «${String(p.title ?? 'карточку')}»`,
      };
    }
    if (type === UserNotificationType.MENTION) {
      return {
        title: 'Упоминание',
        body: `${String(p.authorName ?? 'Кто-то')} упомянул(а) вас`,
      };
    }
    if (type === UserNotificationType.FRIEND_REQUEST) {
      return {
        title: 'Друзья',
        body: `Заявка от ${String(p.requesterName ?? 'пользователя')}`,
        url: '/profile/character',
      };
    }
    return { title: 'Questflow', body: 'Новое уведомление' };
  }

  private async loadInAppSettings(userId: number) {
    const row = await this.prisma.userSettings.findUnique({
      where: { userId },
      select: { site: true },
    });
    const site = row?.site;
    const notifications =
      typeof site === 'object' &&
      site !== null &&
      !Array.isArray(site) &&
      'notifications' in site
        ? (site as Record<string, unknown>).notifications
        : undefined;
    return mergeNotificationSettings(notifications);
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
