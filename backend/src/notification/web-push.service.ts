import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserNotificationType } from '../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import {
  isPushEnabledForType,
  mergeNotificationSettings,
} from './notification-preferences';

type PushPayload = {
  title: string;
  body: string;
  url?: string;
};

@Injectable()
export class WebPushService implements OnModuleInit {
  private readonly logger = new Logger(WebPushService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit(): void {
    if (this.isConfigured()) {
      this.logger.log('Web Push enabled (VAPID keys loaded)');
      return;
    }
    this.logger.warn(
      'Web Push disabled: set VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY and VAPID_SUBJECT in .env (npm run vapid:generate)',
    );
  }

  isConfigured(): boolean {
    return Boolean(
      this.getVapidPublicKey() && this.configService.get<string>('VAPID_PRIVATE_KEY'),
    );
  }

  getVapidPublicKey(): string | null {
    return this.configService.get<string>('VAPID_PUBLIC_KEY') ?? null;
  }

  async subscribe(
    userId: number,
    subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
  ): Promise<void> {
    await this.prisma.webPushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      create: {
        userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
      update: {
        userId,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    });
  }

  async unsubscribe(userId: number, endpoint: string): Promise<void> {
    await this.prisma.webPushSubscription.deleteMany({
      where: { userId, endpoint },
    });
  }

  async notifyUser(
    userId: number,
    type: UserNotificationType,
    payload: PushPayload,
  ): Promise<void> {
    if (!this.isConfigured()) return;
    const publicKey = this.getVapidPublicKey()!;
    const privateKey = this.configService.get<string>('VAPID_PRIVATE_KEY')!;

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
    const settings = mergeNotificationSettings(notifications);
    if (!isPushEnabledForType(settings, type)) return;

    const subs = await this.prisma.webPushSubscription.findMany({
      where: { userId },
    });
    if (subs.length === 0) return;

    try {
      const webpush = await import('web-push');
      webpush.setVapidDetails(
        this.configService.get<string>('VAPID_SUBJECT') ?? 'mailto:support@questflow.local',
        publicKey,
        privateKey,
      );
      const body = JSON.stringify(payload);
      await Promise.all(
        subs.map(async (sub) => {
          try {
            await webpush.sendNotification(
              {
                endpoint: sub.endpoint,
                keys: { p256dh: sub.p256dh, auth: sub.auth },
              },
              body,
            );
          } catch {
            await this.prisma.webPushSubscription.delete({
              where: { id: sub.id },
            });
          }
        }),
      );
    } catch (err) {
      this.logger.warn(`Web push skipped: ${String(err)}`);
    }
  }
}
