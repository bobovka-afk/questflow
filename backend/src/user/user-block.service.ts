import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserBlockService {
  constructor(private readonly prisma: PrismaService) {}

  async assertNotBlocked(userA: number, userB: number): Promise<void> {
    if (userA === userB) return;
    if (await this.areUsersBlocked(userA, userB)) {
      throw new ForbiddenException({
        code: 'USER_BLOCKED',
        message: 'Interaction is not allowed between these users',
      });
    }
  }

  async areUsersBlocked(userA: number, userB: number): Promise<boolean> {
    if (userA === userB) return false;
    const row = await this.prisma.userBlock.findFirst({
      where: {
        OR: [
          { blockerId: userA, blockedId: userB },
          { blockerId: userB, blockedId: userA },
        ],
      },
      select: { id: true },
    });
    return Boolean(row);
  }

  async hasBlocked(blockerId: number, blockedId: number): Promise<boolean> {
    if (blockerId === blockedId) return false;
    const row = await this.prisma.userBlock.findUnique({
      where: {
        blockerId_blockedId: { blockerId, blockedId },
      },
      select: { id: true },
    });
    return Boolean(row);
  }

  async blockUser(blockerId: number, blockedId: number): Promise<void> {
    if (blockerId === blockedId) {
      throw new ConflictException({
        code: 'USER_BLOCK_SELF',
        message: 'You cannot block yourself',
      });
    }
    const target = await this.prisma.user.findUnique({
      where: { id: blockedId },
      select: { id: true },
    });
    if (!target) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }
    await this.prisma.userBlock.upsert({
      where: {
        blockerId_blockedId: { blockerId, blockedId },
      },
      create: { blockerId, blockedId },
      update: {},
    });
  }

  async unblockUser(blockerId: number, blockedId: number): Promise<void> {
    await this.prisma.userBlock.deleteMany({
      where: { blockerId, blockedId },
    });
  }

  async listBlockedUserIds(blockerId: number): Promise<number[]> {
    const rows = await this.prisma.userBlock.findMany({
      where: { blockerId },
      select: { blockedId: true },
    });
    return rows.map((r) => r.blockedId);
  }
}
