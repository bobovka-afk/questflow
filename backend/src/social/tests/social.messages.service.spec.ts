import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createPrismaMock } from '../../testing/prisma-mock';
import { SocialService } from '../social.service';

describe('SocialService — direct messages', () => {
  let service: SocialService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(() => {
    prisma = createPrismaMock();
    const notificationService = { create: jest.fn().mockResolvedValue(undefined) };
    const userBlockService = {
      assertNotBlocked: jest.fn().mockResolvedValue(undefined),
      areUsersBlocked: jest.fn().mockResolvedValue(false),
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

  describe('getMessagesWith edge cases', () => {
    it('rejects self conversation', async () => {
      await expect(service.getMessagesWith(1, 1)).rejects.toThrow(BadRequestException);
    });

    it('throws when peer user missing', async () => {
      prisma.user!.findUnique!.mockResolvedValue(null);
      await expect(service.getMessagesWith(1, 2)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getSentMessageReceipts', () => {
    it('returns empty for self', async () => {
      await expect(service.getSentMessageReceipts(1, 1)).resolves.toEqual([]);
    });
  });

  describe('sendMessage', () => {
    it('allows send for workspace colleagues', async () => {
      prisma.friendRequest!.findFirst!.mockResolvedValue(null);
      prisma.workspaceMember!.findFirst!.mockResolvedValue({ id: 1 });
      prisma.user!.findUnique!.mockResolvedValue({ id: 2 });
      prisma.directMessage!.create!.mockResolvedValue({
        id: 10,
        senderId: 1,
        recipientId: 2,
        body: 'hi',
        readAt: null,
        createdAt: new Date(),
      });
      const msg = await service.sendMessage(1, 2, 'hi');
      expect(msg.id).toBe(10);
    });
  });

  describe('markMessagesRead', () => {
    it('marks incoming messages from peer as read', async () => {
      prisma.directMessage!.updateMany!.mockResolvedValue({ count: 3 });
      await expect(service.markMessagesRead(1, 2)).resolves.toEqual({ updated: 3 });
      expect(prisma.directMessage!.updateMany).toHaveBeenCalledWith({
        where: {
          senderId: 2,
          recipientId: 1,
          readAt: null,
        },
        data: expect.objectContaining({ readAt: expect.any(Date) }),
      });
    });

    it('returns zero when nothing to mark', async () => {
      prisma.directMessage!.updateMany!.mockResolvedValue({ count: 0 });
      await expect(service.markMessagesRead(1, 2)).resolves.toEqual({ updated: 0 });
    });
  });

  describe('listConversations', () => {
    it('aggregates latest message and unread per peer', async () => {
      const older = new Date('2026-05-28T10:00:00Z');
      const newer = new Date('2026-05-28T12:00:00Z');
      prisma.directMessage!.findMany!.mockResolvedValue([
        {
          id: 2,
          senderId: 2,
          recipientId: 1,
          body: 'latest',
          createdAt: newer,
          sender: {
            id: 2,
            name: 'Peer',
            avatarPath: null,
            character: { name: 'H', friendCode: 2000 },
          },
          recipient: {
            id: 1,
            name: 'Me',
            avatarPath: null,
            character: null,
          },
        },
        {
          id: 1,
          senderId: 1,
          recipientId: 2,
          body: 'old',
          createdAt: older,
          sender: {
            id: 1,
            name: 'Me',
            avatarPath: null,
            character: null,
          },
          recipient: {
            id: 2,
            name: 'Peer',
            avatarPath: null,
            character: { name: 'H', friendCode: 2000 },
          },
        },
      ]);
      prisma.directMessage!.groupBy!.mockResolvedValue([
        { senderId: 2, _count: { id: 3 } },
      ]);

      const list = await service.listConversations(1);
      expect(list).toHaveLength(1);
      expect(list[0].peerUserId).toBe(2);
      expect(list[0].lastMessage?.body).toBe('latest');
      expect(list[0].unreadCount).toBe(3);
    });

    it('returns empty when no messages', async () => {
      prisma.directMessage!.findMany!.mockResolvedValue([]);
      await expect(service.listConversations(1)).resolves.toEqual([]);
    });
  });
});
