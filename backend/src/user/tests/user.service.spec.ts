import {
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user.service';
import { PrismaService } from '../../prisma/prisma.service';
import { createPrismaMock } from '../../testing/prisma-mock';
import { UserSettingsService } from '../../user-settings/user-settings.service';

describe('UserService', () => {
  let service: UserService;
  let prisma: ReturnType<typeof createPrismaMock>;
  let userSettingsService: {
    getPrivacySettings: jest.Mock;
  };

  beforeEach(() => {
    prisma = createPrismaMock();
    userSettingsService = {
      getPrivacySettings: jest.fn().mockResolvedValue({
        allowCharacterView: true,
        showAccountAvatarOnPublicProfile: true,
      }),
    };
    const userBlockService = {
      assertNotBlocked: jest.fn().mockResolvedValue(undefined),
      areUsersBlocked: jest.fn().mockResolvedValue(false),
    };
    service = new UserService(
      prisma as unknown as PrismaService,
      userSettingsService as unknown as UserSettingsService,
      userBlockService as never,
    );
  });

  describe('getById', () => {
    it('returns null for non-integer id', async () => {
      await expect(service.getById('abc')).resolves.toBeNull();
    });

    it('returns null when user missing', async () => {
      prisma.user!.findUnique!.mockResolvedValue(null);
      await expect(service.getById('1')).resolves.toBeNull();
    });

    it('strips password from public view', async () => {
      prisma.user!.findUnique!.mockResolvedValue({
        id: 1,
        email: 'a@b.com',
        name: 'U',
        username: null,
        avatarPath: null,
        passwordHash: 'hash',
        createdAt: new Date(),
      });
      await expect(service.getById('1')).resolves.toEqual({
        id: 1,
        email: 'a@b.com',
        name: 'U',
        username: null,
        avatarPath: null,
        hasPassword: true,
        createdAt: expect.any(Date),
      });
    });
  });

  describe('assertProfileAccess', () => {
    it('throws when target missing', async () => {
      prisma.user!.findUnique!.mockResolvedValue(null);
      await expect(service.assertProfileAccess(2, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws when not colleague and not friends', async () => {
      prisma.user!.findUnique!.mockResolvedValue({ id: 2 });
      prisma.workspaceMember!.findFirst!.mockResolvedValue(null);
      prisma.friendRequest!.findFirst!.mockResolvedValue(null);
      await expect(service.assertProfileAccess(2, 1)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('allows access when users are friends without shared workspace', async () => {
      prisma.user!.findUnique!.mockResolvedValue({ id: 2 });
      prisma.workspaceMember!.findFirst!.mockResolvedValue(null);
      prisma.friendRequest!.findFirst!.mockResolvedValue({ id: 9 });
      await expect(service.assertProfileAccess(2, 1)).resolves.toBeUndefined();
    });
  });

  describe('findByEmail', () => {
    it('normalizes email', async () => {
      prisma.user!.findUnique!.mockResolvedValue({ id: 1 });
      await service.findByEmail('  A@B.COM ');
      expect(prisma.user!.findUnique).toHaveBeenCalledWith({
        where: { email: 'a@b.com' },
      });
    });
  });

  it('create hashes password and returns public user', async () => {
    prisma.user!.create!.mockResolvedValue({
      id: 1,
      email: 'a@b.com',
      name: 'U',
      avatarPath: null,
      passwordHash: 'hash',
      createdAt: new Date(),
    });
    const user = await service.create({
      email: 'A@B.COM',
      password: 'secret',
      name: 'U',
    });
    expect(user.hasPassword).toBe(true);
    expect(prisma.user!.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          settings: expect.objectContaining({
            create: expect.objectContaining({
              gamification: expect.any(Object),
            }),
          }),
        }),
      }),
    );
  });

  it('createOAuthUser normalizes email', async () => {
    prisma.user!.create!.mockResolvedValue({ id: 1, email: 'o@x.com' });
    await service.createOAuthUser(' O@X.COM ', 'O', 'pic');
    expect(prisma.user!.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: 'o@x.com',
          settings: expect.objectContaining({ create: expect.any(Object) }),
        }),
      }),
    );
  });

  it('deleteAccount removes user after password check', async () => {
    prisma.user!.findUnique!.mockResolvedValue({
      id: 1,
      passwordHash: 'hash',
    });
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
    prisma.$transaction = jest.fn(async (fn) => {
      const tx = {
        workspaceInvite: { deleteMany: jest.fn().mockResolvedValue({ count: 0 }) },
        workspaceActivity: { deleteMany: jest.fn().mockResolvedValue({ count: 0 }) },
        workspaceMember: { deleteMany: jest.fn().mockResolvedValue({ count: 1 }) },
        user: { delete: jest.fn().mockResolvedValue({ id: 1 }) },
      };
      return fn(tx);
    });

    await expect(service.deleteAccount(1, 'secret', undefined)).resolves.toEqual({
      ok: true,
    });
  });

  it('updateName updates user', async () => {
    prisma.user!.update!.mockResolvedValue({
      id: 1,
      email: 'a@b.com',
      name: 'New',
      avatarPath: null,
      passwordHash: null,
      createdAt: new Date(),
    });
    const user = await service.updateName(1, 'New');
    expect(user.name).toBe('New');
  });
});
