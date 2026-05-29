import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '../generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from '../auth/dto/register.dto';
import type { UserProfileView, UserPublic } from './interface';
import type { UserPublicRow } from './type';
import {
  DEFAULT_GAMIFICATION_SETTINGS,
  DEFAULT_SECURITY_SETTINGS,
  DEFAULT_SITE_SETTINGS,
} from '../user-settings/config/default-user-settings';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

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

  async getProfileForViewer(
    targetUserId: number,
    viewerUserId: number,
  ): Promise<UserProfileView> {

    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        name: true,
        avatarPath: true,
        email: true,
        createdAt: true,
      },
    });
    if (!targetUser) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }

    const shared = await this.prisma.workspaceMember.findFirst({
      where: {
        userId: viewerUserId,
        workspace: {
          members: { some: { userId: targetUserId } },
        },
      },
      select: { id: true },
    });

    if (!shared) {
      throw new ForbiddenException({
        code: 'ACCESS_DENIED',
        message: 'You are not allowed to access this profile',
      });
    }

    return targetUser;
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
