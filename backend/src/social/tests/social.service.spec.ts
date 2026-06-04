import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { FriendRequestStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { createPrismaMock } from '../../testing/prisma-mock';
import { SocialService } from '../social.service';

describe('SocialService', () => {
  let service: SocialService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(() => {
    prisma = createPrismaMock();
    const notificationService = { create: jest.fn().mockResolvedValue(undefined) };
    const userBlockService = {
      assertNotBlocked: jest.fn().mockResolvedValue(undefined),
      areUsersBlocked: jest.fn().mockResolvedValue(false),
      blockUser: jest.fn(),
      unblockUser: jest.fn(),
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

  describe('canMessage', () => {
    it('returns false for self', async () => {
      await expect(service.canMessage(1, 1)).resolves.toBe(false);
    });

    it('returns true for accepted friends', async () => {
      prisma.friendRequest!.findFirst!.mockResolvedValue({
        status: FriendRequestStatus.ACCEPTED,
      });
      await expect(service.canMessage(1, 2)).resolves.toBe(true);
    });

    it('returns true for shared workspace', async () => {
      prisma.friendRequest!.findFirst!.mockResolvedValue(null);
      prisma.workspaceMember!.findFirst!.mockResolvedValue({ id: 1 });
      await expect(service.canMessage(1, 2)).resolves.toBe(true);
    });

    it('returns false when neither friend nor colleague', async () => {
      prisma.friendRequest!.findFirst!.mockResolvedValue(null);
      prisma.workspaceMember!.findFirst!.mockResolvedValue(null);
      await expect(service.canMessage(1, 2)).resolves.toBe(false);
    });
  });

  describe('sendFriendRequest', () => {
    it('rejects self', async () => {
      prisma.character!.findUnique!.mockResolvedValue({ userId: 1 });
      await expect(service.sendFriendRequest(1, 1492)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('rejects unknown code', async () => {
      prisma.character!.findUnique!.mockResolvedValue(null);
      await expect(service.sendFriendRequest(1, 1492)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('creates pending request', async () => {
      prisma.character!.findUnique!.mockResolvedValue({
        userId: 2,
        name: 'Peer',
      });
      prisma.friendRequest!.findFirst!.mockResolvedValue(null);
      prisma.friendRequest!.findUnique!.mockResolvedValue(null);
      prisma.friendRequest!.upsert!.mockResolvedValue({
        id: 10,
        requesterId: 1,
        addresseeId: 2,
        status: FriendRequestStatus.PENDING,
        createdAt: new Date(),
        respondedAt: null,
        requester: {
          id: 1,
          name: 'Me',
          avatarPath: null,
          character: { name: 'Self', friendCode: 1111 },
        },
        addressee: {
          id: 2,
          name: 'Peer',
          avatarPath: null,
          character: { name: 'Hero', friendCode: 1492 },
        },
      });
      const result = await service.sendFriendRequest(1, 1492);
      expect(result.id).toBe(10);
      expect(result.otherUser.userId).toBe(2);
    });
  });

  describe('sendMessage', () => {
    it('throws MESSAGE_NOT_ALLOWED when not allowed', async () => {
      prisma.friendRequest!.findFirst!.mockResolvedValue(null);
      prisma.workspaceMember!.findFirst!.mockResolvedValue(null);
      await expect(service.sendMessage(1, 2, 'hi')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('sends when friends', async () => {
      prisma.friendRequest!.findFirst!.mockResolvedValue({
        status: FriendRequestStatus.ACCEPTED,
      });
      prisma.user!.findUnique!.mockResolvedValue({ id: 2 });
      prisma.directMessage!.create!.mockResolvedValue({
        id: 5,
        senderId: 1,
        recipientId: 2,
        body: 'hi',
        readAt: null,
        createdAt: new Date(),
      });
      const msg = await service.sendMessage(1, 2, 'hi');
      expect(msg.body).toBe('hi');
    });
  });

  describe('getMyFriendCode', () => {
    it('throws without character', async () => {
      prisma.character!.findUnique!.mockResolvedValue(null);
      await expect(service.getMyFriendCode(1)).rejects.toThrow(NotFoundException);
    });

    it('returns formatted code', async () => {
      prisma.character!.findUnique!.mockResolvedValue({ friendCode: 1492 });
      await expect(service.getMyFriendCode(1)).resolves.toEqual({
        friendCode: 1492,
        formatted: '#1492',
      });
    });
  });

  describe('sendFriendRequest conflicts', () => {
    it('rejects when already friends', async () => {
      prisma.character!.findUnique!.mockResolvedValue({ userId: 2 });
      prisma.friendRequest!.findFirst!.mockResolvedValue({
        status: FriendRequestStatus.ACCEPTED,
      });
      await expect(service.sendFriendRequest(1, 1492)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('cancelFriendRequest', () => {
    it('deletes pending outgoing request', async () => {
      prisma.friendRequest!.findUnique!.mockResolvedValue({
        id: 5,
        requesterId: 1,
        addresseeId: 2,
        status: FriendRequestStatus.PENDING,
      });
      prisma.friendRequest!.delete!.mockResolvedValue({});
      await expect(service.cancelFriendRequest(1, 5)).resolves.toBeUndefined();
      expect(prisma.friendRequest!.delete).toHaveBeenCalledWith({ where: { id: 5 } });
    });

    it('rejects when not requester', async () => {
      prisma.friendRequest!.findUnique!.mockResolvedValue({
        id: 5,
        requesterId: 2,
        addresseeId: 1,
        status: FriendRequestStatus.PENDING,
      });
      await expect(service.cancelFriendRequest(1, 5)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getMessagesWith', () => {
    it('returns history without friendship', async () => {
      prisma.user!.findUnique!.mockResolvedValue({ id: 2 });
      prisma.directMessage!.findMany!.mockResolvedValue([
        {
          id: 1,
          senderId: 1,
          recipientId: 2,
          body: 'old',
          readAt: null,
          createdAt: new Date(),
        },
      ]);
      prisma.friendRequest!.findFirst!.mockResolvedValue(null);
      prisma.workspaceMember!.findFirst!.mockResolvedValue(null);
      const rows = await service.getMessagesWith(1, 2);
      expect(rows).toHaveLength(1);
      expect(prisma.directMessage!.findMany).toHaveBeenCalled();
    });
  });

  describe('getSentMessageReceipts', () => {
    it('returns readAt for sent messages', async () => {
      prisma.directMessage!.findMany!.mockResolvedValue([
        { id: 1, readAt: null },
        { id: 2, readAt: new Date() },
      ]);
      const rows = await service.getSentMessageReceipts(1, 2);
      expect(rows).toHaveLength(2);
      expect(rows[1].readAt).toBeTruthy();
    });
  });

  describe('getInboxSummary', () => {
    it('returns counts', async () => {
      prisma.friendRequest!.count!.mockResolvedValue(2);
      prisma.directMessage!.count!.mockResolvedValue(5);
      await expect(service.getInboxSummary(1)).resolves.toEqual({
        incomingFriendRequests: 2,
        unreadMessages: 5,
      });
    });
  });
});
