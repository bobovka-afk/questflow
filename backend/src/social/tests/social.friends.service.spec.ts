import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { FriendRequestStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { createPrismaMock } from '../../testing/prisma-mock';
import { SocialService } from '../social.service';

describe('SocialService — friends', () => {
  let service: SocialService;
  let prisma: ReturnType<typeof createPrismaMock>;
  let userBlockService: {
    assertNotBlocked: jest.Mock;
    areUsersBlocked: jest.Mock;
    hasBlocked: jest.Mock;
  };

  beforeEach(() => {
    prisma = createPrismaMock();
    const notificationService = { create: jest.fn().mockResolvedValue(undefined) };
    userBlockService = {
      assertNotBlocked: jest.fn().mockResolvedValue(undefined),
      areUsersBlocked: jest.fn().mockResolvedValue(false),
      hasBlocked: jest.fn().mockResolvedValue(false),
    };
    const userSettingsService = {
      getPrivacySettings: jest.fn().mockResolvedValue({
        allowFindByCharacterName: true,
        showOnlineStatusToFriends: true,
        allowCharacterView: true,
        showAccountAvatarOnPublicProfile: true,
      }),
    };
    service = new SocialService(
      prisma as unknown as PrismaService,
      notificationService as never,
      userBlockService as never,
      userSettingsService as never,
    );
  });

  describe('acceptFriendRequest', () => {
    it('accepts pending incoming request', async () => {
      prisma.friendRequest!.findUnique!.mockResolvedValue({
        id: 3,
        addresseeId: 1,
        requesterId: 2,
        status: FriendRequestStatus.PENDING,
      });
      prisma.friendRequest!.update!.mockResolvedValue({
        id: 3,
        requesterId: 2,
        addresseeId: 1,
        status: FriendRequestStatus.ACCEPTED,
        createdAt: new Date(),
        respondedAt: new Date(),
        requester: {
          id: 2,
          name: 'Peer',
          avatarPath: null,
          character: { name: 'Hero', friendCode: 2000 },
        },
      });
      const result = await service.acceptFriendRequest(1, 3);
      expect(result.status).toBe(FriendRequestStatus.ACCEPTED);
      expect(prisma.friendRequest!.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 3 },
          data: expect.objectContaining({ status: FriendRequestStatus.ACCEPTED }),
        }),
      );
    });

    it('rejects when request not for addressee', async () => {
      prisma.friendRequest!.findUnique!.mockResolvedValue({
        id: 3,
        addresseeId: 2,
        requesterId: 1,
        status: FriendRequestStatus.PENDING,
      });
      await expect(service.acceptFriendRequest(1, 3)).rejects.toThrow(NotFoundException);
    });
  });

  describe('declineFriendRequest', () => {
    it('declines pending incoming request', async () => {
      prisma.friendRequest!.findUnique!.mockResolvedValue({
        id: 4,
        addresseeId: 1,
        requesterId: 2,
        status: FriendRequestStatus.PENDING,
      });
      prisma.friendRequest!.update!.mockResolvedValue({
        id: 4,
        requesterId: 2,
        addresseeId: 1,
        status: FriendRequestStatus.DECLINED,
        createdAt: new Date(),
        respondedAt: new Date(),
        requester: {
          id: 2,
          name: 'Peer',
          avatarPath: null,
          character: null,
        },
      });
      const result = await service.declineFriendRequest(1, 4);
      expect(result.status).toBe(FriendRequestStatus.DECLINED);
    });
  });

  describe('removeFriend', () => {
    it('deletes accepted friendship', async () => {
      prisma.friendRequest!.findFirst!.mockResolvedValue({
        id: 7,
        status: FriendRequestStatus.ACCEPTED,
      });
      prisma.friendRequest!.delete!.mockResolvedValue({});
      await expect(service.removeFriend(1, 2)).resolves.toBeUndefined();
      expect(prisma.friendRequest!.delete).toHaveBeenCalledWith({ where: { id: 7 } });
    });

    it('throws when not friends', async () => {
      prisma.friendRequest!.findFirst!.mockResolvedValue(null);
      await expect(service.removeFriend(1, 2)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserRelation', () => {
    it('returns incoming pending request id', async () => {
      prisma.friendRequest!.findFirst!.mockResolvedValue({
        id: 9,
        requesterId: 2,
        addresseeId: 1,
        status: FriendRequestStatus.PENDING,
      });
      prisma.workspaceMember!.findFirst!.mockResolvedValue(null);
      const rel = await service.getUserRelation(1, 2);
      expect(rel.incomingRequestId).toBe(9);
      expect(rel.outgoingRequestId).toBeNull();
      expect(rel.isFriend).toBe(false);
      expect(rel.canMessage).toBe(false);
    });

    it('returns canMessage for workspace colleague', async () => {
      prisma.friendRequest!.findFirst!.mockResolvedValue(null);
      prisma.workspaceMember!.findFirst!.mockResolvedValue({ id: 1 });
      const rel = await service.getUserRelation(1, 2);
      expect(rel.canMessage).toBe(true);
      expect(rel.isFriend).toBe(false);
      expect(rel.blockedByMe).toBe(false);
      expect(rel.blockedByThem).toBe(false);
    });

    it('disables messaging when viewer blocked target', async () => {
      prisma.friendRequest!.findFirst!.mockResolvedValue({
        id: 1,
        requesterId: 1,
        addresseeId: 2,
        status: FriendRequestStatus.ACCEPTED,
      });
      prisma.workspaceMember!.findFirst!.mockResolvedValue(null);
      userBlockService.hasBlocked.mockImplementation(async (a: number, b: number) => a === 1 && b === 2);
      const rel = await service.getUserRelation(1, 2);
      expect(rel.blockedByMe).toBe(true);
      expect(rel.canMessage).toBe(false);
      expect(rel.isFriend).toBe(true);
    });
  });

  describe('cancelFriendRequest', () => {
    it('rejects cancel when already accepted', async () => {
      prisma.friendRequest!.findUnique!.mockResolvedValue({
        id: 5,
        requesterId: 1,
        addresseeId: 2,
        status: FriendRequestStatus.ACCEPTED,
      });
      await expect(service.cancelFriendRequest(1, 5)).rejects.toThrow(ConflictException);
    });
  });
});
