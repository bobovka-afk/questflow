import { Injectable, NotFoundException } from '@nestjs/common';
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
import type {
  SessionRequestMeta,
  UserSecurityEventView,
  UserSessionView,
  UserSettingsView,
} from './interface';
import {
  deviceLabelFromUserAgent,
  parseGamificationSettings,
  parseSecuritySettings,
  parseSiteSettings,
} from './lib/settings-json';

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

    return this.registerSession(userId, refreshToken, meta);
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

  async revokeAllOtherSessions(
    userId: number,
    currentRefreshToken: string | undefined,
    meta?: SessionRequestMeta,
  ): Promise<void> {
    const currentHash = currentRefreshToken
      ? this.hashRefreshToken(currentRefreshToken)
      : null;
    await this.prisma.userSession.updateMany({
      where: {
        userId,
        revokedAt: null,
        ...(currentHash ? { NOT: { refreshTokenHash: currentHash } } : {}),
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
  ): Promise<UserSessionView[]> {
    const currentHash = currentRefreshToken
      ? this.hashRefreshToken(currentRefreshToken)
      : null;
    const rows = await this.prisma.userSession.findMany({
      where: { userId },
      orderBy: { lastSeenAt: 'desc' },
      take: 50,
    });
    return rows.map((row) => ({
      id: row.id,
      deviceLabel: row.deviceLabel,
      userAgent: row.userAgent,
      ipAddress: row.ipAddress,
      lastSeenAt: row.lastSeenAt.toISOString(),
      createdAt: row.createdAt.toISOString(),
      expiresAt: row.expiresAt.toISOString(),
      isCurrent: currentHash ? row.refreshTokenHash === currentHash : false,
      isRevoked: Boolean(row.revokedAt),
    }));
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
    return {
      gamification: parseGamificationSettings(row.gamification),
      site: parseSiteSettings(row.site),
      security: parseSecuritySettings(row.security),
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
