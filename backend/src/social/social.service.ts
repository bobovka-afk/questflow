import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FriendRequestStatus, Prisma } from '../generated/prisma/client';
import { UserNotificationType } from '../generated/prisma/enums';
import { NotificationService } from '../notification/notification.service';
import { UserBlockService } from '../user/user-block.service';
import { UserSettingsService } from '../user-settings/user-settings.service';

const ONLINE_WINDOW_MS = 5 * 60 * 1000;
import { PrismaService } from '../prisma/prisma.service';
import {
  formatFriendCode,
  randomFriendCode,
  FRIEND_CODE_MIN,
  FRIEND_CODE_MAX,
} from './lib/friend-code';
import type {
  ConversationPreview,
  DirectMessageView,
  FriendCodeView,
  FriendRequestView,
  FriendView,
  SocialUserSummary,
  SocialInboxSummary,
  UserRelationView,
} from './interface';
import { DIRECT_MESSAGE_BODY_MAX_LENGTH } from './constants';

const userWithCharacterSelect = {
  id: true,
  name: true,
  avatarPath: true,
  lastActiveAt: true,
  character: {
    select: { name: true, friendCode: true },
  },
} satisfies Prisma.UserSelect;

@Injectable()
export class SocialService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly userBlockService: UserBlockService,
    private readonly userSettingsService: UserSettingsService,
  ) {}

  async generateUniqueFriendCode(): Promise<number> {
    for (let attempt = 0; attempt < 50; attempt++) {
      const code = randomFriendCode();
      const existing = await this.prisma.character.findUnique({
        where: { friendCode: code },
        select: { id: true },
      });
      if (!existing) return code;
    }
    throw new ConflictException({
      code: 'FRIEND_CODE_GENERATION_FAILED',
      message: 'Could not generate a unique friend code',
    });
  }

  async getMyFriendCode(userId: number): Promise<FriendCodeView> {
    const character = await this.prisma.character.findUnique({
      where: { userId },
      select: { friendCode: true },
    });
    if (!character) {
      throw new NotFoundException({
        code: 'CHARACTER_NOT_FOUND',
        message: 'Character not found',
      });
    }
    return {
      friendCode: character.friendCode,
      formatted: formatFriendCode(character.friendCode),
    };
  }

  async sendFriendRequest(
    requesterId: number,
    friendCode: number,
  ): Promise<FriendRequestView> {
    if (friendCode < FRIEND_CODE_MIN || friendCode > FRIEND_CODE_MAX) {
      throw new BadRequestException({
        code: 'FRIEND_CODE_INVALID',
        message: 'Friend code must be a 4-digit number',
      });
    }

    const targetCharacter = await this.prisma.character.findUnique({
      where: { friendCode },
      select: { userId: true, name: true },
    });
    if (!targetCharacter) {
      throw new NotFoundException({
        code: 'FRIEND_CODE_NOT_FOUND',
        message: 'No character with this friend code',
      });
    }

    const addresseeId = targetCharacter.userId;
    await this.userBlockService.assertNotBlocked(requesterId, addresseeId);
    if (addresseeId === requesterId) {
      throw new BadRequestException({
        code: 'FRIEND_REQUEST_SELF',
        message: 'You cannot send a friend request to yourself',
      });
    }

    const existing = await this.findFriendshipPair(requesterId, addresseeId);
    if (existing?.status === FriendRequestStatus.ACCEPTED) {
      throw new ConflictException({
        code: 'ALREADY_FRIENDS',
        message: 'You are already friends',
      });
    }

    const reverse = await this.prisma.friendRequest.findUnique({
      where: {
        requesterId_addresseeId: {
          requesterId: addresseeId,
          addresseeId: requesterId,
        },
      },
    });
    if (reverse?.status === FriendRequestStatus.PENDING) {
      throw new ConflictException({
        code: 'FRIEND_REQUEST_INCOMING_EXISTS',
        message: 'This user already sent you a request — accept it instead',
      });
    }

    const row = await this.prisma.friendRequest.upsert({
      where: {
        requesterId_addresseeId: {
          requesterId,
          addresseeId,
        },
      },
      create: {
        requesterId,
        addresseeId,
        status: FriendRequestStatus.PENDING,
      },
      update: {
        status: FriendRequestStatus.PENDING,
        respondedAt: null,
      },
      include: {
        requester: { select: userWithCharacterSelect },
        addressee: { select: userWithCharacterSelect },
      },
    });

    if (row.status === FriendRequestStatus.PENDING) {
      await this.notificationService.create(
        addresseeId,
        UserNotificationType.FRIEND_REQUEST,
        {
          requestId: row.id,
          requesterId,
          requesterName: row.requester?.name ?? 'Пользователь',
        },
      );
    }

    return this.toFriendRequestView(row, requesterId);
  }

  async listFriends(userId: number): Promise<FriendView[]> {
    const rows = await this.prisma.friendRequest.findMany({
      where: {
        status: FriendRequestStatus.ACCEPTED,
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
      include: {
        requester: { select: userWithCharacterSelect },
        addressee: { select: userWithCharacterSelect },
      },
      orderBy: { respondedAt: 'desc' },
    });

    const friends: FriendView[] = [];
    for (const row of rows) {
      const peer =
        row.requesterId === userId ? row.addressee : row.requester;
      const presence = await this.presenceForFriend(userId, peer.id, peer.lastActiveAt);
      friends.push({
        user: { ...this.toSocialUserSummary(peer), ...presence },
        friendsSince: row.respondedAt ?? row.createdAt,
      });
    }
    return friends;
  }

  async searchFriendsByCharacterName(
    viewerId: number,
    query: string,
  ): Promise<SocialUserSummary[]> {
    const q = query.trim();
    if (q.length < 2) {
      return [];
    }
    const rows = await this.prisma.character.findMany({
      where: {
        name: { contains: q, mode: 'insensitive' },
        userId: { not: viewerId },
      },
      take: 20,
      include: { user: { select: userWithCharacterSelect } },
    });
    const results: SocialUserSummary[] = [];
    for (const row of rows) {
      const privacy = await this.userSettingsService.getPrivacySettings(row.userId);
      if (!privacy.allowFindByCharacterName) continue;
      if (await this.userBlockService.areUsersBlocked(viewerId, row.userId)) {
        continue;
      }
      results.push(this.toSocialUserSummary(row.user));
    }
    return results;
  }

  async blockUser(blockerId: number, blockedId: number): Promise<void> {
    await this.userBlockService.blockUser(blockerId, blockedId);
  }

  async unblockUser(blockerId: number, blockedId: number): Promise<void> {
    await this.userBlockService.unblockUser(blockerId, blockedId);
  }

  private async presenceForFriend(
    viewerId: number,
    peerId: number,
    lastActiveAt: Date,
  ): Promise<{ isOnline: boolean; lastSeenAt: string | null }> {
    const privacy = await this.userSettingsService.getPrivacySettings(peerId);
    if (!privacy.showOnlineStatusToFriends) {
      return { isOnline: false, lastSeenAt: null };
    }
    const isFriend = await this.areFriends(viewerId, peerId);
    if (!isFriend) {
      return { isOnline: false, lastSeenAt: null };
    }
    const isOnline = Date.now() - lastActiveAt.getTime() < ONLINE_WINDOW_MS;
    return {
      isOnline,
      lastSeenAt: lastActiveAt.toISOString(),
    };
  }

  async listIncomingRequests(userId: number): Promise<FriendRequestView[]> {
    const rows = await this.prisma.friendRequest.findMany({
      where: { addresseeId: userId, status: FriendRequestStatus.PENDING },
      include: { requester: { select: userWithCharacterSelect } },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => this.toFriendRequestView(row, userId));
  }

  async listOutgoingRequests(userId: number): Promise<FriendRequestView[]> {
    const rows = await this.prisma.friendRequest.findMany({
      where: { requesterId: userId, status: FriendRequestStatus.PENDING },
      include: { addressee: { select: userWithCharacterSelect } },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => this.toFriendRequestView(row, userId));
  }

  async acceptFriendRequest(userId: number, requestId: number): Promise<FriendRequestView> {
    const row = await this.getPendingRequestForAddressee(userId, requestId);
    const updated = await this.prisma.friendRequest.update({
      where: { id: row.id },
      data: {
        status: FriendRequestStatus.ACCEPTED,
        respondedAt: new Date(),
      },
      include: { requester: { select: userWithCharacterSelect } },
    });
    return this.toFriendRequestView(updated, userId);
  }

  async declineFriendRequest(userId: number, requestId: number): Promise<FriendRequestView> {
    const row = await this.getPendingRequestForAddressee(userId, requestId);
    const updated = await this.prisma.friendRequest.update({
      where: { id: row.id },
      data: {
        status: FriendRequestStatus.DECLINED,
        respondedAt: new Date(),
      },
      include: { requester: { select: userWithCharacterSelect } },
    });
    return this.toFriendRequestView(updated, userId);
  }

  async cancelFriendRequest(userId: number, requestId: number): Promise<void> {
    const row = await this.prisma.friendRequest.findUnique({
      where: { id: requestId },
    });
    if (!row || row.requesterId !== userId) {
      throw new NotFoundException({
        code: 'FRIEND_REQUEST_NOT_FOUND',
        message: 'Friend request not found',
      });
    }
    if (row.status !== FriendRequestStatus.PENDING) {
      throw new ConflictException({
        code: 'FRIEND_REQUEST_NOT_PENDING',
        message: 'Friend request is no longer pending',
      });
    }
    await this.prisma.friendRequest.delete({ where: { id: requestId } });
  }

  async getInboxSummary(userId: number): Promise<SocialInboxSummary> {
    const [incomingFriendRequests, unreadMessages] = await Promise.all([
      this.prisma.friendRequest.count({
        where: { addresseeId: userId, status: FriendRequestStatus.PENDING },
      }),
      this.prisma.directMessage.count({
        where: { recipientId: userId, readAt: null },
      }),
    ]);
    return { incomingFriendRequests, unreadMessages };
  }

  async removeFriend(userId: number, otherUserId: number): Promise<void> {
    const row = await this.findFriendshipPair(userId, otherUserId);
    if (!row || row.status !== FriendRequestStatus.ACCEPTED) {
      throw new NotFoundException({
        code: 'FRIENDSHIP_NOT_FOUND',
        message: 'Friendship not found',
      });
    }
    await this.prisma.friendRequest.delete({ where: { id: row.id } });
  }

  async getUserRelation(viewerId: number, targetUserId: number): Promise<UserRelationView> {
    if (viewerId === targetUserId) {
      return {
        isFriend: false,
        canMessage: false,
        incomingRequestId: null,
        outgoingRequestId: null,
        blockedByMe: false,
        blockedByThem: false,
      };
    }

    const [blockedByMe, blockedByThem] = await Promise.all([
      this.userBlockService.hasBlocked(viewerId, targetUserId),
      this.userBlockService.hasBlocked(targetUserId, viewerId),
    ]);
    const interactionBlocked = blockedByMe || blockedByThem;

    const pair = await this.findFriendshipPair(viewerId, targetUserId);
    const isFriend = pair?.status === FriendRequestStatus.ACCEPTED;
    const canMessage =
      !interactionBlocked &&
      (isFriend || (await this.shareWorkspace(viewerId, targetUserId)));

    let incomingRequestId: number | null = null;
    let outgoingRequestId: number | null = null;

    if (pair?.status === FriendRequestStatus.PENDING) {
      if (pair.requesterId === targetUserId) {
        incomingRequestId = pair.id;
      } else {
        outgoingRequestId = pair.id;
      }
    }

    return {
      isFriend,
      canMessage,
      incomingRequestId,
      outgoingRequestId,
      blockedByMe,
      blockedByThem,
    };
  }

  async listConversations(userId: number): Promise<ConversationPreview[]> {
    const messages = await this.prisma.directMessage.findMany({
      where: {
        OR: [{ senderId: userId }, { recipientId: userId }],
      },
      orderBy: { createdAt: 'desc' },
      take: 500,
      include: {
        sender: { select: userWithCharacterSelect },
        recipient: { select: userWithCharacterSelect },
      },
    });

    const byPeer = new Map<number, (typeof messages)[0]>();
    for (const msg of messages) {
      const peerId = msg.senderId === userId ? msg.recipientId : msg.senderId;
      if (!byPeer.has(peerId)) {
        byPeer.set(peerId, msg);
      }
    }

    const peerIds = [...byPeer.keys()];
    if (peerIds.length === 0) return [];

    const unreadGroups = await this.prisma.directMessage.groupBy({
      by: ['senderId'],
      where: {
        recipientId: userId,
        senderId: { in: peerIds },
        readAt: null,
      },
      _count: { id: true },
    });
    const unreadBySender = new Map(
      unreadGroups.map((g) => [g.senderId, g._count.id]),
    );

    const previews: ConversationPreview[] = [];
    for (const [peerId, lastMsg] of byPeer) {
      const peer =
        lastMsg.senderId === userId ? lastMsg.recipient : lastMsg.sender;
      previews.push({
        peerUserId: peerId,
        peer: this.toSocialUserSummary(peer),
        lastMessage: {
          id: lastMsg.id,
          body: lastMsg.body,
          senderId: lastMsg.senderId,
          createdAt: lastMsg.createdAt,
        },
        unreadCount: unreadBySender.get(peerId) ?? 0,
      });
    }

    previews.sort(
      (a, b) =>
        (b.lastMessage?.createdAt.getTime() ?? 0) -
        (a.lastMessage?.createdAt.getTime() ?? 0),
    );
    return previews;
  }

  async getMessagesWith(
    viewerId: number,
    peerUserId: number,
    sinceMessageId?: number,
    limit = 50,
  ): Promise<DirectMessageView[]> {
    if (viewerId === peerUserId) {
      throw new BadRequestException({
        code: 'MESSAGE_SELF',
        message: 'You cannot message yourself',
      });
    }

    const peer = await this.prisma.user.findUnique({
      where: { id: peerUserId },
      select: { id: true },
    });
    if (!peer) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }

    const where: Prisma.DirectMessageWhereInput = {
      OR: [
        { senderId: viewerId, recipientId: peerUserId },
        { senderId: peerUserId, recipientId: viewerId },
      ],
    };
    if (sinceMessageId != null) {
      where.id = { gt: sinceMessageId };
    }

    const rows = await this.prisma.directMessage.findMany({
      where,
      orderBy: { id: 'asc' },
      take: Math.min(limit, 100),
    });
    return rows.map((row) => this.toDirectMessageView(row));
  }

  async getSentMessageReceipts(
    viewerId: number,
    peerUserId: number,
  ): Promise<Array<Pick<DirectMessageView, 'id' | 'readAt'>>> {
    if (viewerId === peerUserId) return [];

    const rows = await this.prisma.directMessage.findMany({
      where: { senderId: viewerId, recipientId: peerUserId },
      select: { id: true, readAt: true },
      orderBy: { id: 'asc' },
    });
    return rows.map((row) => ({ id: row.id, readAt: row.readAt }));
  }

  async sendMessage(
    senderId: number,
    recipientId: number,
    body: string,
  ): Promise<DirectMessageView> {
    const trimmed = body.trim();
    if (!trimmed) {
      throw new BadRequestException({
        code: 'MESSAGE_BODY_EMPTY',
        message: 'Message body cannot be empty',
      });
    }
    if (trimmed.length > DIRECT_MESSAGE_BODY_MAX_LENGTH) {
      throw new BadRequestException({
        code: 'MESSAGE_BODY_TOO_LONG',
        message: `Message must be at most ${DIRECT_MESSAGE_BODY_MAX_LENGTH} characters`,
      });
    }
    if (senderId === recipientId) {
      throw new BadRequestException({
        code: 'MESSAGE_SELF',
        message: 'You cannot message yourself',
      });
    }

    await this.assertCanMessage(senderId, recipientId);

    const target = await this.prisma.user.findUnique({
      where: { id: recipientId },
      select: { id: true },
    });
    if (!target) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }

    const row = await this.prisma.directMessage.create({
      data: {
        senderId,
        recipientId,
        body: trimmed,
      },
    });
    return this.toDirectMessageView(row);
  }

  async markMessagesRead(viewerId: number, peerUserId: number): Promise<{ updated: number }> {
    const result = await this.prisma.directMessage.updateMany({
      where: {
        senderId: peerUserId,
        recipientId: viewerId,
        readAt: null,
      },
      data: { readAt: new Date() },
    });
    return { updated: result.count };
  }

  async canMessage(viewerId: number, targetUserId: number): Promise<boolean> {
    if (viewerId === targetUserId) return false;
    if (await this.areFriends(viewerId, targetUserId)) return true;
    return this.shareWorkspace(viewerId, targetUserId);
  }

  private async assertCanMessage(viewerId: number, targetUserId: number): Promise<void> {
    await this.userBlockService.assertNotBlocked(viewerId, targetUserId);
    const allowed = await this.canMessage(viewerId, targetUserId);
    if (!allowed) {
      throw new ForbiddenException({
        code: 'MESSAGE_NOT_ALLOWED',
        message: 'You can only message friends or workspace colleagues',
      });
    }
  }

  private async areFriends(userA: number, userB: number): Promise<boolean> {
    const row = await this.findFriendshipPair(userA, userB);
    return row?.status === FriendRequestStatus.ACCEPTED;
  }

  async shareWorkspace(viewerUserId: number, targetUserId: number): Promise<boolean> {
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

  private async findFriendshipPair(userA: number, userB: number) {
    return this.prisma.friendRequest.findFirst({
      where: {
        OR: [
          { requesterId: userA, addresseeId: userB },
          { requesterId: userB, addresseeId: userA },
        ],
      },
    });
  }

  private async getPendingRequestForAddressee(userId: number, requestId: number) {
    const row = await this.prisma.friendRequest.findUnique({
      where: { id: requestId },
    });
    if (!row || row.addresseeId !== userId) {
      throw new NotFoundException({
        code: 'FRIEND_REQUEST_NOT_FOUND',
        message: 'Friend request not found',
      });
    }
    if (row.status !== FriendRequestStatus.PENDING) {
      throw new ConflictException({
        code: 'FRIEND_REQUEST_NOT_PENDING',
        message: 'Friend request is no longer pending',
      });
    }
    return row;
  }

  private toSocialUserSummary(
    user: Prisma.UserGetPayload<{ select: typeof userWithCharacterSelect }>,
  ): SocialUserSummary {
    return {
      userId: user.id,
      name: user.name,
      avatarPath: user.avatarPath,
      characterName: user.character?.name ?? null,
      friendCode: user.character?.friendCode ?? null,
    };
  }

  private toFriendRequestView(
    row: {
      id: number;
      status: FriendRequestStatus;
      createdAt: Date;
      respondedAt: Date | null;
      requesterId: number;
      addresseeId: number;
      requester?: Prisma.UserGetPayload<{ select: typeof userWithCharacterSelect }>;
      addressee?: Prisma.UserGetPayload<{ select: typeof userWithCharacterSelect }>;
    },
    viewerId: number,
  ): FriendRequestView {
    const other =
      row.requesterId === viewerId
        ? row.addressee!
        : row.requester!;
    return {
      id: row.id,
      status: row.status,
      createdAt: row.createdAt,
      respondedAt: row.respondedAt,
      otherUser: this.toSocialUserSummary(other),
    };
  }

  private toDirectMessageView(row: {
    id: number;
    senderId: number;
    recipientId: number;
    body: string;
    readAt: Date | null;
    createdAt: Date;
  }): DirectMessageView {
    return {
      id: row.id,
      senderId: row.senderId,
      recipientId: row.recipientId,
      body: row.body,
      readAt: row.readAt,
      createdAt: row.createdAt,
    };
  }
}
