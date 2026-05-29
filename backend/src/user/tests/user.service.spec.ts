import {
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user.service';
import { PrismaService } from '../../prisma/prisma.service';
import { createPrismaMock } from '../../testing/prisma-mock';

describe('UserService', () => {
  let service: UserService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(() => {
    prisma = createPrismaMock();
    service = new UserService(prisma as unknown as PrismaService);
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
        avatarPath: null,
        passwordHash: 'hash',
        createdAt: new Date(),
      });
      await expect(service.getById('1')).resolves.toEqual({
        id: 1,
        email: 'a@b.com',
        name: 'U',
        avatarPath: null,
        hasPassword: true,
        createdAt: expect.any(Date),
      });
    });
  });

  describe('getProfileForViewer', () => {
    it('throws when target missing', async () => {
      prisma.user!.findUnique!.mockResolvedValue(null);
      await expect(service.getProfileForViewer(2, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws when workspaces not shared', async () => {
      prisma.user!.findUnique!.mockResolvedValue({ id: 2, name: 'T' });
      prisma.workspaceMember!.findFirst!.mockResolvedValue(null);
      await expect(service.getProfileForViewer(2, 1)).rejects.toThrow(
        ForbiddenException,
      );
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

  it('getProfileForViewer returns user when shared workspace', async () => {
    prisma.user!.findUnique!.mockResolvedValue({ id: 2, name: 'T' });
    prisma.workspaceMember!.findFirst!.mockResolvedValue({ id: 1 });
    await expect(service.getProfileForViewer(2, 1)).resolves.toEqual({
      id: 2,
      name: 'T',
    });
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
