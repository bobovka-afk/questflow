import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma, User } from '../generated/prisma/client';
import { FriendRequestStatus } from '../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from '../auth/dto/register.dto';
import type { UserPublic } from './interface';
import type { UserPublicRow } from './type';
import {
  DEFAULT_GAMIFICATION_SETTINGS,
  DEFAULT_SECURITY_SETTINGS,
  DEFAULT_SITE_SETTINGS,
} from '../user-settings/config/default-user-settings';
import { UserSettingsService } from '../user-settings/user-settings.service';
import { UserBlockService } from './user-block.service';
import { isValidUsername, normalizeUsername } from './lib/username';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userSettingsService: UserSettingsService,
    private readonly userBlockService: UserBlockService,
  ) {}

  async getById(id: string): Promise<UserPublic | null> {
    const userId = Number(id);
    if (!Number.isInteger(userId)) return null;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        avatarPath: true,
        passwordHash: true,
        createdAt: true,
      },
    });
    if (!user) return null;
    return this.toUserPublic(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = this.normalizeEmail(email);
    return this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
  }

  async touchLastActive(userId: number): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { lastActiveAt: new Date() },
    });
  }

  async resolveUsername(raw: string): Promise<{ id: number; username: string } | null> {
    const username = normalizeUsername(raw);
    if (!isValidUsername(username)) return null;
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: { id: true, username: true },
    });
    if (!user?.username) return null;
    return { id: user.id, username: user.username };
  }

  async updateUsername(userId: number, raw: string): Promise<UserPublic> {
    const username = normalizeUsername(raw);
    if (!isValidUsername(username)) {
      throw new BadRequestException({
        code: 'USERNAME_INVALID',
        message: 'Username must be 3–32 chars: a-z, 0-9, underscore',
      });
    }
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: { username },
        select: {
          id: true,
          email: true,
          name: true,
          username: true,
          avatarPath: true,
          passwordHash: true,
          createdAt: true,
        },
      });
      return this.toUserPublic(user);
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException({
          code: 'USERNAME_TAKEN',
          message: 'Username is already taken',
        });
      }
      throw e;
    }
  }

  async assertProfileAccess(targetUserId: number, viewerUserId: number): Promise<void> {
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true },
    });
    if (!targetUser) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }

    await this.userBlockService.assertNotBlocked(viewerUserId, targetUserId);

    const canView =
      (await this.shareWorkspace(viewerUserId, targetUserId)) ||
      (await this.areFriends(viewerUserId, targetUserId));

    if (!canView) {
      throw new ForbiddenException({
        code: 'ACCESS_DENIED',
        message: 'You are not allowed to access this profile',
      });
    }
  }

  private async shareWorkspace(viewerUserId: number, targetUserId: number): Promise<boolean> {
    const shared = await this.prisma.workspaceMember.findFirst({
      where: {
        userId: viewerUserId,
        workspace: {
          members: { some: { userId: targetUserId } },
        },
      },
      select: { id: true },
    });
    return Boolean(shared);
  }

  private async areFriends(userA: number, userB: number): Promise<boolean> {
    const row = await this.prisma.friendRequest.findFirst({
      where: {
        status: FriendRequestStatus.ACCEPTED,
        OR: [
          { requesterId: userA, addresseeId: userB },
          { requesterId: userB, addresseeId: userA },
        ],
      },
      select: { id: true },
    });
    return Boolean(row);
  }

  async create(dto: RegisterDto): Promise<UserPublic> {
    const normalizedEmail = this.normalizeEmail(dto.email);
    const user = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        name: dto.name,
        passwordHash: await bcrypt.hash(dto.password, 10),
        settings: {
          create: {
            gamification: DEFAULT_GAMIFICATION_SETTINGS as Prisma.InputJsonValue,
            site: DEFAULT_SITE_SETTINGS as Prisma.InputJsonValue,
            security: DEFAULT_SECURITY_SETTINGS as Prisma.InputJsonValue,
          },
        },
      },
    });
    return this.toUserPublic(user);
  }

  async createOAuthUser(
    email: string,
    name: string,
    picture: string,
  ): Promise<User> {
    const normalizedEmail = this.normalizeEmail(email);
    const user = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        name,
        avatarPath: picture,
        emailVerifiedAt: new Date(),
        settings: {
          create: {
            gamification: DEFAULT_GAMIFICATION_SETTINGS as Prisma.InputJsonValue,
            site: DEFAULT_SITE_SETTINGS as Prisma.InputJsonValue,
            security: DEFAULT_SECURITY_SETTINGS as Prisma.InputJsonValue,
          },
        },
      },
    });

    return user;
  }

  async updateAvatar(id: number, avatarPath: string): Promise<UserPublic> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { avatarPath },
      select: {
        id: true,
        email: true,
        name: true,
        avatarPath: true,
        passwordHash: true,
        username: true,
        createdAt: true,
      },
    });
    return this.toUserPublic(user);
  }

  async removeAvatar(id: number): Promise<UserPublic> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { avatarPath: null },
      select: {
        id: true,
        email: true,
        name: true,
        avatarPath: true,
        passwordHash: true,
        username: true,
        createdAt: true,
      },
    });
    return this.toUserPublic(user);
  }

  async updateName(id: number, name: string): Promise<UserPublic> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { name },
      select: {
        id: true,
        email: true,
        name: true,
        avatarPath: true,
        passwordHash: true,
        username: true,
        createdAt: true,
      },
    });
    return this.toUserPublic(user);
  }

  async deleteAccount(
    userId: number,
    password: string | undefined,
    confirmPhrase: string | undefined,
  ): Promise<{ ok: boolean }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, passwordHash: true },
    });
    if (!user) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }

    if (user.passwordHash) {
      if (!password) {
        throw new BadRequestException({
          code: 'PASSWORD_REQUIRED',
          message: 'Password is required to delete account',
        });
      }
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        throw new UnauthorizedException({
          code: 'INVALID_CURRENT_PASSWORD',
          message: 'Current password is invalid',
        });
      }
    } else if (confirmPhrase?.trim() !== 'УДАЛИТЬ') {
      throw new BadRequestException({
        code: 'CONFIRM_PHRASE_REQUIRED',
        message: 'Type УДАЛИТЬ to confirm account deletion',
      });
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.workspaceInvite.deleteMany({ where: { invitedByUserId: userId } });
      await tx.workspaceActivity.deleteMany({ where: { actorUserId: userId } });
      await tx.workspaceMember.deleteMany({ where: { userId } });
      await tx.user.delete({ where: { id: userId } });
    });

    return { ok: true };
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private toUserPublic(user: UserPublicRow): UserPublic {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username ?? null,
      avatarPath: user.avatarPath,
      hasPassword: Boolean(user.passwordHash),
      createdAt: user.createdAt,
    };
  }
}
