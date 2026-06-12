export type FriendCodeView = {
  friendCode: number;
  formatted: string;
};

export type SocialUserSummary = {
  userId: number;
  name: string;
  avatarPath: string | null;
  characterName: string | null;
  characterAvatarPreset: string | null;
  friendCode: number | null;
  isOnline?: boolean;
  lastSeenAt?: string | null;
};

export type FriendRequestView = {
  id: number;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt: Date;
  respondedAt: Date | null;
  otherUser: SocialUserSummary;
};

export type FriendView = {
  user: SocialUserSummary;
  friendsSince: Date;
};

export type ConversationPreview = {
  peerUserId: number;
  peer: SocialUserSummary;
  lastMessage: {
    id: number;
    body: string;
    senderId: number;
    createdAt: Date;
  } | null;
  unreadCount: number;
};

export type DirectMessageView = {
  id: number;
  senderId: number;
  recipientId: number;
  body: string;
  readAt: Date | null;
  createdAt: Date;
};

export type UserRelationView = {
  user: SocialUserSummary;
  isFriend: boolean;
  canMessage: boolean;
  incomingRequestId: number | null;
  outgoingRequestId: number | null;
  blockedByMe: boolean;
  blockedByThem: boolean;
};

export type SocialInboxSummary = {
  incomingFriendRequests: number;
  unreadMessages: number;
};
