import {
  BadRequestException,
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
import type { UserProfileView, UserPublic } from './interface';
import type { UserPublicRow } from './type';
import {
  DEFAULT_GAMIFICATION_SETTINGS,
  DEFAULT_SECURITY_SETTINGS,
  DEFAULT_SITE_SETTINGS,
} from '../user-settings/config/default-user-settings';
import { UserSettingsService } from '../user-settings/user-settings.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userSettingsService: UserSettingsService,
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

  async getProfileForViewer(
    targetUserId: number,
    viewerUserId: number,
  ): Promise<UserProfileView> {
    await this.assertProfileAccess(targetUserId, viewerUserId);

    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        name: true,
        avatarPath: true,
        createdAt: true,
        character: { select: { friendCode: true } },
      },
    });
    if (!targetUser) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }

    const privacy = await this.userSettingsService.getPrivacySettings(targetUserId);

    return {
      id: targetUser.id,
      name: targetUser.name,
      avatarPath: privacy.showAccountAvatarOnPublicProfile
        ? targetUser.avatarPath
        : null,
      createdAt: targetUser.createdAt,
      allowCharacterView: privacy.allowCharacterView,
      friendCode: targetUser.character?.friendCode ?? null,
    };
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
      avatarPath: user.avatarPath,
      hasPassword: Boolean(user.passwordHash),
      createdAt: user.createdAt,
    };
  }
}
