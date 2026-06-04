import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UserSecurityEventType } from '../generated/prisma/enums';
import {
  DEFAULT_GAMIFICATION_SETTINGS,
  DEFAULT_SECURITY_SETTINGS,
  DEFAULT_SITE_SETTINGS,
} from './config/default-user-settings';
import { UpdateGamificationSettingsDto } from './dto/update-gamification-settings.dto';
import { UpdatePrivacySettingsDto } from './dto/update-privacy-settings.dto';
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto';
import type {
  NotificationSettingsJson,
  PrivacySettingsJson,
} from './config/default-user-settings';
import type {
  SessionRequestMeta,
  UserSecurityEventView,
  UserSessionView,
  UserSettingsView,
} from './interface';
import {
  deviceLabelFromUserAgent,
  parseGamificationSettings,
  parseNotificationSettings,
  parsePrivacySettings,
  parseDisplayTimezone,
  parseSecuritySettings,
  parseSiteSettings,
} from './lib/settings-json';
import { isPendingEmailChange } from './lib/pending-email-change';

@Injectable()
export class UserSettingsService {
  private readonly refreshTokenDays = 7;

  constructor(private readonly prisma: PrismaService) {}

  hashRefreshToken(refreshToken: string): string {
    return crypto.createHash('sha256').update(refreshToken).digest('hex');
  }

  async ensureSettings(userId: number) {
    return this.prisma.userSettings.upsert({
      where: { userId },
      create: {
        userId,
        gamification: DEFAULT_GAMIFICATION_SETTINGS as Prisma.InputJsonValue,
        site: DEFAULT_SITE_SETTINGS as Prisma.InputJsonValue,
        security: DEFAULT_SECURITY_SETTINGS as Prisma.InputJsonValue,
      },
      update: {},
    });
  }

  async getSettings(userId: number): Promise<UserSettingsView> {
    const row = await this.ensureSettings(userId);
    return this.toSettingsView(row);
  }

  async updateGamificationSettings(
    userId: number,
    dto: UpdateGamificationSettingsDto,
    meta?: SessionRequestMeta,
  ): Promise<UserSettingsView> {
    const current = await this.ensureSettings(userId);
    const merged = parseGamificationSettings({
      ...parseGamificationSettings(current.gamification),
      ...dto,
    });
    const updated = await this.prisma.userSettings.update({
      where: { userId },
      data: { gamification: merged as Prisma.InputJsonValue },
    });
    await this.logSecurityEvent(
      userId,
      UserSecurityEventType.GAMIFICATION_SETTINGS_CHANGED,
      { changes: dto },
      meta,
    );
    return this.toSettingsView(updated);
  }

  async getPrivacySettings(userId: number): Promise<PrivacySettingsJson> {
    const row = await this.ensureSettings(userId);
    return parseSecuritySettings(row.security).privacy;
  }

  async updatePrivacySettings(
    userId: number,
    dto: UpdatePrivacySettingsDto,
    meta?: SessionRequestMeta,
  ): Promise<UserSettingsView> {
    const current = await this.ensureSettings(userId);
    const security = parseSecuritySettings(current.security);
    const mergedPrivacy = parsePrivacySettings({
      ...security.privacy,
      ...dto,
    });
    const updated = await this.prisma.userSettings.update({
      where: { userId },
      data: {
        security: {
          ...security,
          privacy: mergedPrivacy,
        } as Prisma.InputJsonValue,
      },
    });
    await this.logSecurityEvent(
      userId,
      UserSecurityEventType.SECURITY_SETTINGS_CHANGED,
      { privacy: dto },
      meta,
    );
    return this.toSettingsView(updated);
  }

  async updateDisplayTimezone(
    userId: number,
    displayTimezone: string,
    meta?: SessionRequestMeta,
  ): Promise<UserSettingsView> {
    const current = await this.ensureSettings(userId);
    const site = parseSiteSettings(current.site);
    const updated = await this.prisma.userSettings.update({
      where: { userId },
      data: {
        site: {
          ...site,
          displayTimezone: displayTimezone.trim(),
        } as Prisma.InputJsonValue,
      },
    });
    await this.logSecurityEvent(
      userId,
      UserSecurityEventType.SITE_SETTINGS_CHANGED,
      { displayTimezone: displayTimezone.trim() },
      meta,
    );
    return this.toSettingsView(updated);
  }

  async updateNotificationSettings(
    userId: number,
    dto: UpdateNotificationSettingsDto,
    meta?: SessionRequestMeta,
  ): Promise<UserSettingsView> {
    const current = await this.ensureSettings(userId);
    const site = parseSiteSettings(current.site);
    const merged = parseNotificationSettings({
      ...parseNotificationSettings(site.notifications),
      ...dto,
    });
    const updated = await this.prisma.userSettings.update({
      where: { userId },
      data: {
        site: {
          ...site,
          notifications: merged,
        } as Prisma.InputJsonValue,
      },
    });
    await this.logSecurityEvent(
      userId,
      UserSecurityEventType.SITE_SETTINGS_CHANGED,
      { notifications: dto },
      meta,
    );
    return this.toSettingsView(updated);
  }

  async getNotificationSettings(userId: number): Promise<NotificationSettingsJson> {
    const row = await this.ensureSettings(userId);
    const site = parseSiteSettings(row.site);
    return parseNotificationSettings(site.notifications);
  }

  async allowsSecurityEmail(userId: number): Promise<boolean> {
    const settings = await this.getNotificationSettings(userId);
    return settings.emailSecurity;
  }

  /** Unregistered invitees always receive mail; registered users respect workspace-invite toggle. */
  async allowsWorkspaceInviteEmailForAddress(email: string): Promise<boolean> {
    const normalized = email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email: normalized },
      select: { id: true },
    });
    if (!user) return true;
    const settings = await this.getNotificationSettings(user.id);
    return settings.emailWorkspaceInvites;
  }

  async getPendingEmailChange(userId: number) {
    const row = await this.ensureSettings(userId);
    const site = parseSiteSettings(row.site);
    const pending = site.pendingEmailChange;
    if (!isPendingEmailChange(pending)) return null;
    return pending;
  }

  async setPendingEmailChange(
    userId: number,
    newEmail: string,
  ): Promise<void> {
    const current = await this.ensureSettings(userId);
    const site = parseSiteSettings(current.site);
    await this.prisma.userSettings.update({
      where: { userId },
      data: {
        site: {
          ...site,
          pendingEmailChange: {
            newEmail,
            oldConfirmedAt: null,
            newConfirmedAt: null,
            requestedAt: new Date().toISOString(),
          },
        } as Prisma.InputJsonValue,
      },
    });
  }

  async clearPendingEmailChange(userId: number): Promise<void> {
    const current = await this.ensureSettings(userId);
    const site = parseSiteSettings(current.site);
    const { pendingEmailChange: _removed, ...rest } = site;
    await this.prisma.userSettings.update({
      where: { userId },
      data: { site: rest as Prisma.InputJsonValue },
    });
  }

  async markEmailChangeConfirmation(
    userId: number,
    side: 'old' | 'new',
  ): Promise<{ oldConfirmed: boolean; newConfirmed: boolean; newEmail: string | null }> {
    const current = await this.ensureSettings(userId);
    const site = parseSiteSettings(current.site);
    const pending = site.pendingEmailChange;
    if (!isPendingEmailChange(pending)) {
      return { oldConfirmed: false, newConfirmed: false, newEmail: null };
    }
    const now = new Date().toISOString();
    const next = {
      ...pending,
      oldConfirmedAt:
        side === 'old' ? now : pending.oldConfirmedAt ?? null,
      newConfirmedAt:
        side === 'new' ? now : pending.newConfirmedAt ?? null,
    };
    await this.prisma.userSettings.update({
      where: { userId },
      data: {
        site: {
          ...site,
          pendingEmailChange: next,
        } as Prisma.InputJsonValue,
      },
    });
    return {
      oldConfirmed: Boolean(next.oldConfirmedAt),
      newConfirmed: Boolean(next.newConfirmedAt),
      newEmail: next.newEmail,
    };
  }

  async registerSession(
    userId: number,
    refreshToken: string,
    meta?: SessionRequestMeta,
  ) {
    const expiresAt = this.refreshExpiresAt();
    const session = await this.prisma.userSession.create({
      data: {
        userId,
        refreshTokenHash: this.hashRefreshToken(refreshToken),
        userAgent: meta?.userAgent ?? null,
        ipAddress: meta?.ipAddress ?? null,
        deviceLabel: deviceLabelFromUserAgent(meta?.userAgent) ?? null,
        expiresAt,
      },
    });
    await this.logSecurityEvent(
      userId,
      UserSecurityEventType.SESSION_CREATED,
      { sessionId: session.id, deviceLabel: session.deviceLabel },
      meta,
      session.id,
    );
    return session;
  }

  async resolveRefreshSession(refreshToken: string, userId: number, meta?: SessionRequestMeta) {
    const hash = this.hashRefreshToken(refreshToken);
    const existing = await this.prisma.userSession.findUnique({
      where: { refreshTokenHash: hash },
    });

    if (existing) {
      if (
        existing.userId !== userId ||
        existing.revokedAt ||
        existing.expiresAt <= new Date()
      ) {
        return null;
      }
      return existing;
    }

    return null;
  }

  async rotateRefreshSession(
    sessionId: string,
    newRefreshToken: string,
    meta?: SessionRequestMeta,
  ): Promise<void> {
    await this.prisma.userSession.update({
      where: { id: sessionId },
      data: {
        refreshTokenHash: this.hashRefreshToken(newRefreshToken),
        lastSeenAt: new Date(),
        expiresAt: this.refreshExpiresAt(),
        ...(meta?.userAgent !== undefined ? { userAgent: meta.userAgent } : {}),
        ...(meta?.ipAddress !== undefined ? { ipAddress: meta.ipAddress } : {}),
        ...(meta?.userAgent !== undefined
          ? { deviceLabel: deviceLabelFromUserAgent(meta.userAgent) ?? null }
          : {}),
      },
    });
  }

  async revokeSessionByRefreshToken(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) return;
    const hash = this.hashRefreshToken(refreshToken);
    const session = await this.prisma.userSession.findUnique({
      where: { refreshTokenHash: hash },
    });
    if (!session || session.revokedAt) return;
    await this.revokeSessionById(session.userId, session.id);
  }

  async revokeSessionById(
    userId: number,
    sessionId: string,
    meta?: SessionRequestMeta,
  ): Promise<void> {
    const updated = await this.prisma.userSession.updateMany({
      where: { id: sessionId, userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    if (updated.count === 0) {
      throw new NotFoundException({
        code: 'SESSION_NOT_FOUND',
        message: 'Session not found',
      });
    }
    await this.logSecurityEvent(
      userId,
      UserSecurityEventType.SESSION_REVOKED,
      { sessionId },
      meta,
      sessionId,
    );
  }

  async isSessionActive(userId: number, sessionId: string): Promise<boolean> {
    const row = await this.prisma.userSession.findFirst({
      where: {
        id: sessionId,
        userId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      select: { id: true },
    });
    return Boolean(row);
  }

  async revokeAllOtherSessions(
    userId: number,
    currentRefreshToken: string | undefined,
    currentSessionId: string | undefined,
    meta?: SessionRequestMeta,
  ): Promise<void> {
    const currentHash = currentRefreshToken
      ? this.hashRefreshToken(currentRefreshToken)
      : null;
    if (!currentHash && !currentSessionId) {
      throw new BadRequestException({
        code: 'SESSION_CONTEXT_REQUIRED',
        message: 'Cannot identify current session',
      });
    }
    const keepCurrent: Prisma.UserSessionWhereInput[] = [];
    if (currentHash) {
      keepCurrent.push({ refreshTokenHash: currentHash });
    }
    if (currentSessionId) {
      keepCurrent.push({ id: currentSessionId });
    }
    await this.prisma.userSession.updateMany({
      where: {
        userId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
        NOT: { OR: keepCurrent },
      },
      data: { revokedAt: new Date() },
    });
    await this.logSecurityEvent(
      userId,
      UserSecurityEventType.SESSIONS_REVOKED_ALL_OTHER,
      {},
      meta,
    );
  }

  async revokeAllSessions(userId: number, meta?: SessionRequestMeta): Promise<void> {
    await this.prisma.userSession.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    await this.logSecurityEvent(
      userId,
      UserSecurityEventType.SESSIONS_REVOKED_ALL_OTHER,
      { all: true },
      meta,
    );
  }

  async listSessions(
    userId: number,
    currentRefreshToken?: string,
    currentSessionId?: string,
    meta?: SessionRequestMeta,
  ): Promise<UserSessionView[]> {
    const currentHash = currentRefreshToken
      ? this.hashRefreshToken(currentRefreshToken)
      : null;
    const now = new Date();

    let rows = await this.prisma.userSession.findMany({
      where: { userId, revokedAt: null },
      orderBy: { lastSeenAt: 'desc' },
      take: 50,
    });

    rows = await this.ensureSessionsListed(
      userId,
      rows,
      currentHash,
      currentRefreshToken,
      currentSessionId,
      meta,
    );

    const views = rows.map((row) => {
      const matchesId = currentSessionId ? row.id === currentSessionId : false;
      const matchesHash = currentHash ? row.refreshTokenHash === currentHash : false;
      const isCurrent = matchesId || matchesHash;
      return {
        id: row.id,
        deviceLabel: row.deviceLabel,
        userAgent: row.userAgent,
        ipAddress: row.ipAddress,
        lastSeenAt: row.lastSeenAt.toISOString(),
        createdAt: row.createdAt.toISOString(),
        expiresAt: row.expiresAt.toISOString(),
        isCurrent,
        isRevoked: false,
        isExpired: isCurrent ? false : row.expiresAt <= now,
      };
    });

    return views.sort((a, b) => {
      if (a.isCurrent !== b.isCurrent) return a.isCurrent ? -1 : 1;
      return new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime();
    });
  }

  private async ensureSessionsListed(
    userId: number,
    rows: Awaited<ReturnType<PrismaService['userSession']['findMany']>>,
    currentHash: string | null,
    currentRefreshToken?: string,
    currentSessionId?: string,
    meta?: SessionRequestMeta,
  ) {
    if (currentSessionId && !rows.some((row) => row.id === currentSessionId)) {
      const byId = await this.prisma.userSession.findFirst({
        where: { id: currentSessionId, userId, revokedAt: null },
      });
      if (byId) {
        rows = [byId, ...rows];
      }
    }

    if (rows.length === 0 && currentRefreshToken) {
      const hash = this.hashRefreshToken(currentRefreshToken);
      const byHash = await this.prisma.userSession.findUnique({
        where: { refreshTokenHash: hash },
      });
      if (byHash && byHash.userId === userId && !byHash.revokedAt) {
        rows = [byHash];
      } else if (!byHash) {
        const created = await this.registerSession(userId, currentRefreshToken, meta);
        rows = [created];
      }
    }

    const currentRow = currentSessionId
      ? rows.find((row) => row.id === currentSessionId)
      : currentHash
        ? rows.find((row) => row.refreshTokenHash === currentHash)
        : rows.length === 1
          ? rows[0]
          : undefined;

    if (currentRow && currentRow.expiresAt <= new Date()) {
      const extended = await this.prisma.userSession.update({
        where: { id: currentRow.id },
        data: {
          expiresAt: this.refreshExpiresAt(),
          lastSeenAt: new Date(),
          ...(meta?.userAgent !== undefined ? { userAgent: meta.userAgent } : {}),
          ...(meta?.ipAddress !== undefined ? { ipAddress: meta.ipAddress } : {}),
          ...(meta?.userAgent !== undefined
            ? { deviceLabel: deviceLabelFromUserAgent(meta.userAgent) ?? null }
            : {}),
        },
      });
      rows = rows.map((row) => (row.id === extended.id ? extended : row));
    } else if (currentRow) {
      await this.prisma.userSession.update({
        where: { id: currentRow.id },
        data: { lastSeenAt: new Date() },
      });
      currentRow.lastSeenAt = new Date();
    }

    return rows;
  }

  async listSecurityEvents(
    userId: number,
    limit = 50,
  ): Promise<UserSecurityEventView[]> {
    const rows = await this.prisma.userSecurityEvent.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return rows.map((row) => ({
      id: row.id,
      type: row.type,
      metadata: (row.metadata as Record<string, unknown> | null) ?? null,
      ipAddress: row.ipAddress,
      deviceLabel: deviceLabelFromUserAgent(row.userAgent ?? undefined) ?? null,
      createdAt: row.createdAt.toISOString(),
    }));
  }

  async logPasswordChanged(
    userId: number,
    hadPassword: boolean,
    meta?: SessionRequestMeta,
  ): Promise<void> {
    await this.logSecurityEvent(
      userId,
      hadPassword
        ? UserSecurityEventType.PASSWORD_CHANGED
        : UserSecurityEventType.PASSWORD_SET,
      {},
      meta,
    );
  }

  async logPasswordReset(userId: number, meta?: SessionRequestMeta): Promise<void> {
    await this.logSecurityEvent(
      userId,
      UserSecurityEventType.PASSWORD_RESET,
      {},
      meta,
    );
  }

  private refreshExpiresAt(): Date {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.refreshTokenDays);
    return expiresAt;
  }

  private toSettingsView(row: {
    gamification: unknown;
    site: unknown;
    security: unknown;
    updatedAt: Date;
  }): UserSettingsView {
    const security = parseSecuritySettings(row.security);
    const site = parseSiteSettings(row.site);
    return {
      gamification: parseGamificationSettings(row.gamification),
      site,
      security,
      privacy: security.privacy,
      notifications: parseNotificationSettings(site.notifications),
      displayTimezone: parseDisplayTimezone(site) ?? null,
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  private async logSecurityEvent(
    userId: number,
    type: UserSecurityEventType,
    metadata: Record<string, unknown>,
    meta?: SessionRequestMeta,
    sessionId?: string,
  ): Promise<void> {
    await this.prisma.userSecurityEvent.create({
      data: {
        userId,
        type,
        metadata: metadata as Prisma.InputJsonValue,
        ipAddress: meta?.ipAddress ?? null,
        userAgent: meta?.userAgent ?? null,
        sessionId: sessionId ?? null,
      },
    });
  }
}
