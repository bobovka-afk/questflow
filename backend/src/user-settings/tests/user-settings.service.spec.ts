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
      expect(result.updatedAt).toBe('2026-05-28T12:00:00.000Z');
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

    it('registers legacy session when hash is missing', async () => {
      prisma.userSession.findUnique.mockResolvedValue(null);
      prisma.userSession.create.mockResolvedValue({ id: 'session-new' });
      prisma.userSecurityEvent.create.mockResolvedValue({ id: 1 });

      const session = await service.resolveRefreshSession('legacy-token', 3);
      expect(session).toEqual(expect.objectContaining({ id: 'session-new' }));
      expect(prisma.userSession.create).toHaveBeenCalled();
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

      await service.revokeAllOtherSessions(4, 'current-refresh');

      expect(prisma.userSession.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: 4,
            revokedAt: null,
            NOT: { refreshTokenHash: service.hashRefreshToken('current-refresh') },
          }),
        }),
      );
    });
  });

  describe('listSessions', () => {
    it('marks current session by refresh token hash', async () => {
      const hash = service.hashRefreshToken('current');
      prisma.userSession.findMany.mockResolvedValue([
        {
          id: 'a',
          deviceLabel: 'macOS',
          userAgent: 'ua',
          ipAddress: '1.1.1.1',
          lastSeenAt: new Date('2026-05-28T10:00:00.000Z'),
          createdAt: new Date('2026-05-28T09:00:00.000Z'),
          expiresAt: new Date('2026-06-04T10:00:00.000Z'),
          refreshTokenHash: hash,
          revokedAt: null,
        },
        {
          id: 'b',
          deviceLabel: 'Windows',
          userAgent: 'ua2',
          ipAddress: '2.2.2.2',
          lastSeenAt: new Date('2026-05-27T10:00:00.000Z'),
          createdAt: new Date('2026-05-27T09:00:00.000Z'),
          expiresAt: new Date('2026-06-03T10:00:00.000Z'),
          refreshTokenHash: 'other',
          revokedAt: new Date(),
        },
      ]);

      const rows = await service.listSessions(1, 'current');
      expect(rows[0]?.isCurrent).toBe(true);
      expect(rows[0]?.isRevoked).toBe(false);
      expect(rows[1]?.isCurrent).toBe(false);
      expect(rows[1]?.isRevoked).toBe(true);
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
