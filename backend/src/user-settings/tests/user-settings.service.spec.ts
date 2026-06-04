import { NotFoundException } from '@nestjs/common';
import { UserSecurityEventType } from '../../generated/prisma/enums';
import { UserSettingsService } from '../user-settings.service';
import { createPrismaMock } from '../../testing/prisma-mock';

describe('UserSettingsService', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let service: UserSettingsService;

  beforeEach(() => {
    prisma = createPrismaMock();
    service = new UserSettingsService(prisma as never);
  });

  describe('getSettings', () => {
    it('returns default gamification settings on ensure', async () => {
      prisma.userSettings.upsert.mockResolvedValue({
        userId: 1,
        gamification: {
          checkinAnimationOnCardClose: true,
          xpGainNotifications: true,
        },
        site: {},
        security: {},
        updatedAt: new Date('2026-05-28T12:00:00.000Z'),
      });

      const result = await service.getSettings(1);
      expect(result.gamification).toEqual({
        checkinAnimationOnCardClose: true,
        xpGainNotifications: true,
      });
      expect(result.privacy).toEqual({
        allowCharacterView: true,
        showAccountAvatarOnPublicProfile: true,
        allowFindByCharacterName: false,
        showOnlineStatusToFriends: true,
      });
      expect(result.updatedAt).toBe('2026-05-28T12:00:00.000Z');
    });
  });

  describe('email notification preferences', () => {
    it('allowsSecurityEmail respects stored settings', async () => {
      prisma.userSettings.upsert.mockResolvedValue({
        userId: 1,
        gamification: {},
        site: { notifications: { emailSecurity: false, emailWorkspaceInvites: true } },
        security: {},
        updatedAt: new Date(),
      });
      await expect(service.allowsSecurityEmail(1)).resolves.toBe(false);
    });

    it('allowsWorkspaceInviteEmailForAddress is true for unknown email', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(
        service.allowsWorkspaceInviteEmailForAddress('new@b.com'),
      ).resolves.toBe(true);
    });

    it('allowsWorkspaceInviteEmailForAddress respects user settings', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 9 });
      prisma.userSettings.upsert.mockResolvedValue({
        userId: 9,
        gamification: {},
        site: { notifications: { emailSecurity: true, emailWorkspaceInvites: false } },
        security: {},
        updatedAt: new Date(),
      });
      await expect(
        service.allowsWorkspaceInviteEmailForAddress('off@b.com'),
      ).resolves.toBe(false);
    });
  });

  describe('updatePrivacySettings', () => {
    it('updates privacy and logs security event', async () => {
      prisma.userSettings.upsert.mockResolvedValue({
        userId: 1,
        gamification: {},
        site: {},
        security: { privacy: { allowCharacterView: true, showAccountAvatarOnPublicProfile: true } },
        updatedAt: new Date(),
      });
      prisma.userSettings.update.mockResolvedValue({
        userId: 1,
        gamification: {},
        site: {},
        security: {
          privacy: { allowCharacterView: false, showAccountAvatarOnPublicProfile: true },
        },
        updatedAt: new Date('2026-05-28T12:00:00.000Z'),
      });
      prisma.userSecurityEvent.create.mockResolvedValue({ id: 1 });

      const result = await service.updatePrivacySettings(
        1,
        { allowCharacterView: false },
        { ipAddress: '127.0.0.1' },
      );

      expect(result.privacy.allowCharacterView).toBe(false);
      expect(prisma.userSecurityEvent.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            type: UserSecurityEventType.SECURITY_SETTINGS_CHANGED,
          }),
        }),
      );
    });
  });

  describe('updateGamificationSettings', () => {
    it('updates gamification settings and logs security event', async () => {
      prisma.userSettings.upsert.mockResolvedValue({
        userId: 1,
        gamification: {
          checkinAnimationOnCardClose: true,
          xpGainNotifications: true,
        },
        site: {},
        security: {},
        updatedAt: new Date(),
      });
      prisma.userSettings.update.mockResolvedValue({
        userId: 1,
        gamification: {
          checkinAnimationOnCardClose: false,
          xpGainNotifications: true,
        },
        site: {},
        security: {},
        updatedAt: new Date('2026-05-28T12:00:00.000Z'),
      });
      prisma.userSecurityEvent.create.mockResolvedValue({ id: 1 });

      const result = await service.updateGamificationSettings(
        1,
        { checkinAnimationOnCardClose: false },
        { ipAddress: '127.0.0.1' },
      );

      expect(result.gamification.checkinAnimationOnCardClose).toBe(false);
      expect(prisma.userSecurityEvent.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            type: UserSecurityEventType.GAMIFICATION_SETTINGS_CHANGED,
            ipAddress: '127.0.0.1',
          }),
        }),
      );
    });
  });

  describe('hashRefreshToken', () => {
    it('returns stable sha256 hash', () => {
      const a = service.hashRefreshToken('refresh-token');
      const b = service.hashRefreshToken('refresh-token');
      expect(a).toBe(b);
      expect(a).toHaveLength(64);
    });
  });

  describe('registerSession', () => {
    it('creates session and logs SESSION_CREATED', async () => {
      prisma.userSession.create.mockResolvedValue({
        id: 'session-1',
        deviceLabel: 'macOS',
      });
      prisma.userSecurityEvent.create.mockResolvedValue({ id: 10 });

      const session = await service.registerSession(5, 'refresh-abc', {
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)',
        ipAddress: '10.0.0.5',
      });

      expect(session.id).toBe('session-1');
      expect(prisma.userSession.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 5,
            refreshTokenHash: service.hashRefreshToken('refresh-abc'),
            deviceLabel: 'macOS',
            ipAddress: '10.0.0.5',
          }),
        }),
      );
      expect(prisma.userSecurityEvent.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            type: UserSecurityEventType.SESSION_CREATED,
            sessionId: 'session-1',
          }),
        }),
      );
    });
  });

  describe('resolveRefreshSession', () => {
    it('returns existing active session', async () => {
      prisma.userSession.findUnique.mockResolvedValue({
        id: 'session-2',
        userId: 3,
        revokedAt: null,
        expiresAt: new Date(Date.now() + 60_000),
      });

      const session = await service.resolveRefreshSession('token', 3);
      expect(session).toEqual(
        expect.objectContaining({ id: 'session-2' }),
      );
      expect(prisma.userSession.create).not.toHaveBeenCalled();
    });

    it('returns null for revoked session', async () => {
      prisma.userSession.findUnique.mockResolvedValue({
        id: 'session-2',
        userId: 3,
        revokedAt: new Date(),
        expiresAt: new Date(Date.now() + 60_000),
      });

      await expect(service.resolveRefreshSession('token', 3)).resolves.toBeNull();
    });

    it('returns null when refresh hash is unknown', async () => {
      prisma.userSession.findUnique.mockResolvedValue(null);

      await expect(service.resolveRefreshSession('unknown-token', 3)).resolves.toBeNull();
      expect(prisma.userSession.create).not.toHaveBeenCalled();
    });
  });

  describe('rotateRefreshSession', () => {
    it('updates refresh hash and lastSeenAt', async () => {
      prisma.userSession.update.mockResolvedValue({ id: 'session-1' });

      await service.rotateRefreshSession('session-1', 'new-refresh', {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0)',
      });

      expect(prisma.userSession.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'session-1' },
          data: expect.objectContaining({
            refreshTokenHash: service.hashRefreshToken('new-refresh'),
            deviceLabel: 'Windows',
          }),
        }),
      );
    });
  });

  describe('revokeSessionByRefreshToken', () => {
    it('revokes active session by refresh token hash', async () => {
      prisma.userSession.findUnique.mockResolvedValue({
        id: 'session-3',
        userId: 8,
        revokedAt: null,
      });
      prisma.userSession.updateMany.mockResolvedValue({ count: 1 });
      prisma.userSecurityEvent.create.mockResolvedValue({ id: 1 });

      await service.revokeSessionByRefreshToken('refresh-x');

      expect(prisma.userSession.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'session-3', userId: 8, revokedAt: null },
        }),
      );
    });

    it('no-ops when token missing or session already revoked', async () => {
      await service.revokeSessionByRefreshToken(undefined);
      expect(prisma.userSession.findUnique).not.toHaveBeenCalled();

      prisma.userSession.findUnique.mockResolvedValue({
        id: 'session-3',
        userId: 8,
        revokedAt: new Date(),
      });
      await service.revokeSessionByRefreshToken('refresh-x');
      expect(prisma.userSession.updateMany).not.toHaveBeenCalled();
    });
  });

  describe('revokeAllOtherSessions', () => {
    it('revokes all sessions except current refresh token', async () => {
      prisma.userSession.updateMany.mockResolvedValue({ count: 2 });
      prisma.userSecurityEvent.create.mockResolvedValue({ id: 1 });

      await service.revokeAllOtherSessions(4, 'current-refresh', 'session-current');

      expect(prisma.userSession.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: 4,
            revokedAt: null,
            NOT: {
              OR: [
                { refreshTokenHash: service.hashRefreshToken('current-refresh') },
                { id: 'session-current' },
              ],
            },
          }),
        }),
      );
    });
  });

  describe('listSessions', () => {
    it('marks current session by refresh token hash', async () => {
      const hash = service.hashRefreshToken('current');
      const sessionA = {
        id: 'a',
        deviceLabel: 'macOS',
        userAgent: 'ua',
        ipAddress: '1.1.1.1',
        lastSeenAt: new Date('2026-05-28T10:00:00.000Z'),
        createdAt: new Date('2026-05-28T09:00:00.000Z'),
        expiresAt: new Date('2026-06-04T10:00:00.000Z'),
        refreshTokenHash: hash,
        revokedAt: null,
      };
      prisma.userSession.findMany.mockResolvedValue([
        sessionA,
        {
          id: 'b',
          deviceLabel: 'Windows',
          userAgent: 'ua2',
          ipAddress: '2.2.2.2',
          lastSeenAt: new Date('2026-05-27T10:00:00.000Z'),
          createdAt: new Date('2026-05-27T09:00:00.000Z'),
          expiresAt: new Date('2026-06-03T10:00:00.000Z'),
          refreshTokenHash: 'other',
          revokedAt: null,
        },
      ]);
      prisma.userSession.update.mockResolvedValue(sessionA);

      const rows = await service.listSessions(1, 'current', 'a');
      expect(rows).toHaveLength(2);
      expect(rows[0]?.isCurrent).toBe(true);
      expect(rows[1]?.isCurrent).toBe(false);
      expect(rows[0]?.isRevoked).toBe(false);
      expect(prisma.userSession.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 1, revokedAt: null },
        }),
      );
      expect(rows[0]?.isExpired).toBe(false);
    });

    it('materializes session from refresh cookie when list is empty', async () => {
      prisma.userSession.findMany.mockResolvedValue([]);
      prisma.userSession.findUnique.mockResolvedValue(null);
      prisma.userSession.create.mockResolvedValue({
        id: 'session-new',
        deviceLabel: 'macOS',
        userAgent: 'ua',
        ipAddress: '1.1.1.1',
        lastSeenAt: new Date(),
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 86_400_000),
        refreshTokenHash: service.hashRefreshToken('refresh-1'),
        revokedAt: null,
      });
      prisma.userSecurityEvent.create.mockResolvedValue({ id: 1 });
      prisma.userSession.update.mockImplementation(async ({ where }) => ({
        id: where.id,
        deviceLabel: 'macOS',
        userAgent: 'ua',
        ipAddress: '1.1.1.1',
        lastSeenAt: new Date(),
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 86_400_000),
        refreshTokenHash: service.hashRefreshToken('refresh-1'),
        revokedAt: null,
      }));

      const rows = await service.listSessions(1, 'refresh-1', undefined);
      expect(rows).toHaveLength(1);
      expect(rows[0]?.isCurrent).toBe(true);
      expect(prisma.userSession.create).toHaveBeenCalled();
    });
  });

  describe('listSecurityEvents', () => {
    it('returns mapped security events', async () => {
      prisma.userSecurityEvent.findMany.mockResolvedValue([
        {
          id: 7,
          type: UserSecurityEventType.PASSWORD_CHANGED,
          metadata: { source: 'test' },
          ipAddress: '127.0.0.1',
          createdAt: new Date('2026-05-28T11:00:00.000Z'),
        },
      ]);

      const rows = await service.listSecurityEvents(1);
      expect(rows).toEqual([
        {
          id: 7,
          type: UserSecurityEventType.PASSWORD_CHANGED,
          metadata: { source: 'test' },
          ipAddress: '127.0.0.1',
          deviceLabel: null,
          createdAt: '2026-05-28T11:00:00.000Z',
        },
      ]);
    });
  });

  describe('revokeSessionById', () => {
    it('throws when revoking missing session', async () => {
      prisma.userSession.updateMany.mockResolvedValue({ count: 0 });
      await expect(service.revokeSessionById(1, 'missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('logPasswordChanged', () => {
    it('logs PASSWORD_SET when user had no password', async () => {
      prisma.userSecurityEvent.create.mockResolvedValue({ id: 1 });
      await service.logPasswordChanged(2, false);
      expect(prisma.userSecurityEvent.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            type: UserSecurityEventType.PASSWORD_SET,
          }),
        }),
      );
    });
  });
});
