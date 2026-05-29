import {
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AuthTokenType } from '../../generated/prisma/enums';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../../mail/mail.service';
import { UserSettingsService } from '../../user-settings/user-settings.service';
import { createPrismaMock } from '../../testing/prisma-mock';

describe('AuthService', () => {
  let service: AuthService;
  let userService: jest.Mocked<
    Pick<UserService, 'findByEmail' | 'create' | 'getById' | 'createOAuthUser'>
  >;
  let jwtService: jest.Mocked<Pick<JwtService, 'sign' | 'verifyAsync'>>;
  let configService: { get: jest.Mock };
  let prisma: ReturnType<typeof createPrismaMock>;
  let mailService: jest.Mocked<
    Pick<MailService, 'sendEmailVerification' | 'sendPasswordReset'>
  >;
  let userSettingsService: jest.Mocked<
    Pick<
      UserSettingsService,
      | 'registerSession'
      | 'resolveRefreshSession'
      | 'rotateRefreshSession'
      | 'revokeSessionByRefreshToken'
      | 'revokeAllOtherSessions'
      | 'revokeAllSessions'
      | 'logPasswordChanged'
      | 'logPasswordReset'
    >
  >;

  beforeEach(() => {
    userService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      getById: jest.fn(),
      createOAuthUser: jest.fn(),
    };
    jwtService = {
      sign: jest.fn().mockReturnValue('token'),
      verifyAsync: jest.fn(),
    };
    configService = {
      get: jest.fn((key: string) => {
        const map: Record<string, string> = {
          SERVER_URL: 'http://api.test',
          CLIENT_URL: 'http://app.test',
          SERVER_DOMAIN: 'api.test',
        };
        return map[key];
      }),
    };
    prisma = createPrismaMock();
    mailService = {
      sendEmailVerification: jest.fn(),
      sendPasswordReset: jest.fn(),
    };
    userSettingsService = {
      registerSession: jest.fn().mockResolvedValue({ id: 'session-1' }),
      resolveRefreshSession: jest.fn().mockResolvedValue({ id: 'session-1' }),
      rotateRefreshSession: jest.fn().mockResolvedValue(undefined),
      revokeSessionByRefreshToken: jest.fn().mockResolvedValue(undefined),
      revokeAllOtherSessions: jest.fn().mockResolvedValue(undefined),
      revokeAllSessions: jest.fn().mockResolvedValue(undefined),
      logPasswordChanged: jest.fn().mockResolvedValue(undefined),
      logPasswordReset: jest.fn().mockResolvedValue(undefined),
    };
    service = new AuthService(
      userService as unknown as UserService,
      jwtService as unknown as JwtService,
      configService as unknown as ConfigService,
      prisma as unknown as PrismaService,
      mailService as unknown as MailService,
      userSettingsService as unknown as UserSettingsService,
    );
  });

  describe('register', () => {
    it('rejects existing email', async () => {
      userService.findByEmail.mockResolvedValue({ id: 1 } as never);
      await expect(
        service.register({
          email: 'A@B.COM',
          password: 'secret',
          name: 'U',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('creates user and requests verification', async () => {
      userService.findByEmail.mockResolvedValue(null);
      userService.create.mockResolvedValue({ id: 2, email: 'a@b.com' } as never);
      userService.findByEmail.mockResolvedValueOnce(null).mockResolvedValueOnce({
        id: 2,
        email: 'a@b.com',
        emailVerifiedAt: null,
      } as never);
      prisma.authToken!.create!.mockResolvedValue({});

      const user = await service.register({
        email: 'A@B.COM',
        password: 'secret',
        name: 'U',
      });

      expect(user).toEqual({ id: 2, email: 'a@b.com' });
      expect(userService.create).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'a@b.com' }),
      );
    });
  });

  describe('issueTokens', () => {
    it('signs access and refresh tokens', () => {
      const tokens = service.issueTokens(42);
      expect(tokens).toEqual({
        accessToken: 'token',
        refreshToken: 'token',
      });
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
    });
  });

  describe('getNewTokens', () => {
    it('rejects invalid refresh token', async () => {
      jwtService.verifyAsync.mockRejectedValue(new Error('bad'));
      await expect(service.getNewTokens('x')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('rejects missing user', async () => {
      jwtService.verifyAsync.mockResolvedValue({ id: '7' });
      userService.getById.mockResolvedValue(null);
      await expect(service.getNewTokens('x')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('returns user and tokens', async () => {
      jwtService.verifyAsync.mockResolvedValue({ id: '7' });
      userService.getById.mockResolvedValue({ id: 7 } as never);
      const result = await service.getNewTokens('refresh');
      expect(result.user).toEqual({ id: 7 });
      expect(result.accessToken).toBe('token');
      expect(userSettingsService.resolveRefreshSession).toHaveBeenCalledWith(
        'refresh',
        7,
        undefined,
      );
      expect(userSettingsService.rotateRefreshSession).toHaveBeenCalledWith(
        'session-1',
        'token',
        undefined,
      );
    });

    it('rejects refresh when session cannot be resolved', async () => {
      jwtService.verifyAsync.mockResolvedValue({ id: '7' });
      userService.getById.mockResolvedValue({ id: 7 } as never);
      userSettingsService.resolveRefreshSession.mockResolvedValue(null);
      await expect(service.getNewTokens('refresh')).rejects.toThrow(
        UnauthorizedException,
      );
      expect(userSettingsService.rotateRefreshSession).not.toHaveBeenCalled();
    });
  });

  describe('validateOAuthLogin', () => {
    it('creates OAuth user when missing', async () => {
      userService.findByEmail.mockResolvedValue(null);
      userService.createOAuthUser.mockResolvedValue({ id: 3 } as never);
      const result = await service.validateOAuthLogin({
        user: { email: 'O@X.COM', name: 'O', picture: 'p' },
      });
      expect(result.user.id).toBe(3);
      expect(userService.createOAuthUser).toHaveBeenCalledWith(
        'o@x.com',
        'O',
        'p',
      );
      expect(userSettingsService.registerSession).toHaveBeenCalledWith(
        3,
        'token',
        undefined,
      );
    });

    it('marks email verified for existing OAuth user', async () => {
      userService.findByEmail.mockResolvedValue({
        id: 4,
        emailVerifiedAt: null,
      } as never);
      prisma.user!.update!.mockResolvedValue({
        id: 4,
        emailVerifiedAt: new Date(),
      });
      const result = await service.validateOAuthLogin({
        user: { email: 'o@x.com', name: 'O', picture: 'p' },
      });
      expect(result.user.id).toBe(4);
      expect(prisma.user!.update).toHaveBeenCalled();
    });
  });

  describe('confirmEmailVerification', () => {
    it('requires token', async () => {
      await expect(service.confirmEmailVerification('')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('rejects invalid token', async () => {
      prisma.authToken!.findUnique!.mockResolvedValue(null);
      await expect(service.confirmEmailVerification('t')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('confirms valid token', async () => {
      prisma.authToken!.findUnique!.mockResolvedValue({
        id: 1,
        userId: 2,
        type: AuthTokenType.EMAIL_VERIFICATION,
        usedAt: null,
        expiresAt: new Date(Date.now() + 60_000),
      });
      prisma.$transaction!.mockResolvedValue([]);
      await expect(service.confirmEmailVerification('t')).resolves.toEqual({
        ok: true,
      });
    });
  });

  describe('requestPasswordReset', () => {
    it('returns ok when user unknown', async () => {
      userService.findByEmail.mockResolvedValue(null);
      await expect(
        service.requestPasswordReset('a@b.com'),
      ).resolves.toEqual({ ok: true });
      expect(prisma.authToken!.create).not.toHaveBeenCalled();
    });

    it('creates reset token for existing user', async () => {
      userService.findByEmail.mockResolvedValue({ id: 1, email: 'a@b.com' } as never);
      prisma.authToken!.create!.mockResolvedValue({});
      await expect(
        service.requestPasswordReset('a@b.com'),
      ).resolves.toEqual({ ok: true });
      expect(mailService.sendPasswordReset).toHaveBeenCalled();
    });
  });

  describe('confirmPasswordReset', () => {
    it('requires password', async () => {
      await expect(service.confirmPasswordReset('t', '')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('changePassword', () => {
    it('requires new password', async () => {
      await expect(service.changePassword(1, 'old', '')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('requires current password when hash exists', async () => {
      prisma.user!.findUnique!.mockResolvedValue({
        id: 1,
        passwordHash: 'hash',
      });
      await expect(service.changePassword(1, undefined, 'new')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('rejects same password', async () => {
      prisma.user!.findUnique!.mockResolvedValue({
        id: 1,
        passwordHash: await bcrypt.hash('same', 4),
      });
      await expect(
        service.changePassword(1, 'same', 'same'),
      ).rejects.toThrow(BadRequestException);
    });

    it('updates password when valid', async () => {
      const hash = await bcrypt.hash('old', 4);
      prisma.user!.findUnique!.mockResolvedValue({ id: 1, passwordHash: hash });
      prisma.user!.update!.mockResolvedValue({});
      await expect(
        service.changePassword(1, 'old', 'new-pass', { ipAddress: '127.0.0.1' }, 'refresh-current'),
      ).resolves.toEqual({ ok: true });
      expect(userSettingsService.logPasswordChanged).toHaveBeenCalledWith(
        1,
        true,
        { ipAddress: '127.0.0.1' },
      );
      expect(userSettingsService.revokeAllOtherSessions).toHaveBeenCalledWith(
        1,
        'refresh-current',
        { ipAddress: '127.0.0.1' },
      );
    });
  });

  describe('logout', () => {
    it('revokes session by refresh token', async () => {
      await service.logout('refresh-x');
      expect(userSettingsService.revokeSessionByRefreshToken).toHaveBeenCalledWith(
        'refresh-x',
      );
    });
  });

  describe('refresh cookie helpers', () => {
    it('sets refresh cookie on response', () => {
      const res = { cookie: jest.fn() };
      service.addRefreshTokenToResponse(res as never, 'rt');
      expect(res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'rt',
        expect.objectContaining({ httpOnly: true }),
      );
    });

    it('clears refresh cookie', () => {
      const res = { cookie: jest.fn() };
      service.removeRefreshTokenFromResponse(res as never);
      expect(res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        '',
        expect.objectContaining({ expires: expect.any(Date) }),
      );
    });
  });

  describe('confirmPasswordReset', () => {
    it('resets password for valid token', async () => {
      prisma.authToken!.findUnique!.mockResolvedValue({
        id: 1,
        userId: 2,
        type: AuthTokenType.PASSWORD_RESET,
        usedAt: null,
        expiresAt: new Date(Date.now() + 60_000),
      });
      prisma.$transaction!.mockResolvedValue([]);
      await expect(
        service.confirmPasswordReset('token', 'new-pass', { ipAddress: '10.0.0.2' }),
      ).resolves.toEqual({ ok: true });
      expect(userSettingsService.logPasswordReset).toHaveBeenCalledWith(2, {
        ipAddress: '10.0.0.2',
      });
      expect(userSettingsService.revokeAllSessions).toHaveBeenCalledWith(2, {
        ipAddress: '10.0.0.2',
      });
    });
  });

  describe('login', () => {
    it('rejects invalid credentials', async () => {
      userService.findByEmail.mockResolvedValue(null);
      await expect(
        service.login({ email: 'a@b.com', password: 'x' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('returns tokens for valid user', async () => {
      const hash = await bcrypt.hash('pass', 4);
      userService.findByEmail.mockResolvedValue({
        id: 5,
        email: 'a@b.com',
        name: 'U',
        passwordHash: hash,
        createdAt: new Date(),
      } as never);
      const result = await service.login(
        { email: 'a@b.com', password: 'pass' },
        { userAgent: 'TestAgent' },
      );
      expect(result.accessToken).toBe('token');
      expect(result.user.id).toBe(5);
      expect(userSettingsService.registerSession).toHaveBeenCalledWith(
        5,
        'token',
        { userAgent: 'TestAgent' },
      );
    });
  });
});
