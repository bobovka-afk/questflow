export type FriendCodeView = {
  friendCode: number;
  formatted: string;
};

export type SocialUserSummary = {
  userId: number;
  name: string;
  avatarPath: string | null;
  characterName: string | null;
  friendCode: number | null;
};

export type FriendRequestView = {
  id: number;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt: string;
  respondedAt: string | null;
  otherUser: SocialUserSummary;
};

export type FriendView = {
  user: SocialUserSummary;
  friendsSince: string;
};

export type ConversationPreview = {
  peerUserId: number;
  peer: SocialUserSummary;
  lastMessage: {
    id: number;
    body: string;
    senderId: number;
    createdAt: string;
  } | null;
  unreadCount: number;
};

export type DirectMessageView = {
  id: number;
  senderId: number;
  recipientId: number;
  body: string;
  readAt: string | null;
  createdAt: string;
};

export type MessageReadReceipt = {
  id: number;
  readAt: string | null;
};

export type UserRelationView = {
  isFriend: boolean;
  canMessage: boolean;
  incomingRequestId: number | null;
  outgoingRequestId: number | null;
};

export type SocialInboxSummary = {
  incomingFriendRequests: number;
  unreadMessages: number;
};
