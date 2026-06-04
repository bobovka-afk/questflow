import { api } from '@shared/api';
import type {
  ConversationPreview,
  DirectMessageView,
  FriendCodeView,
  FriendRequestView,
  FriendView,
  MessageReadReceipt,
  SocialInboxSummary,
  UserRelationView,
} from '../model/types';

export function fetchMyFriendCode(accessToken: string) {
  return api<FriendCodeView>('/social/me/code', { method: 'GET', accessToken });
}

export function sendFriendRequest(accessToken: string, friendCode: number) {
  return api<FriendRequestView>('/social/friends/request', {
    method: 'POST',
    accessToken,
    json: { friendCode },
  });
}

export function fetchFriends(accessToken: string) {
  return api<FriendView[]>('/social/friends', { method: 'GET', accessToken });
}

export function searchFriendsByCharacterName(accessToken: string, query: string) {
  const q = encodeURIComponent(query.trim());
  return api<import('../model/types').SocialUserSummary[]>(
    `/social/friends/search?q=${q}`,
    { method: 'GET', accessToken },
  );
}

export function blockUser(accessToken: string, userId: number) {
  return api<{ ok: boolean }>(`/social/block/${userId}`, {
    method: 'POST',
    accessToken,
  });
}

export function unblockUser(accessToken: string, userId: number) {
  return api<{ ok: boolean }>(`/social/block/${userId}`, {
    method: 'DELETE',
    accessToken,
  });
}

export function fetchIncomingFriendRequests(accessToken: string) {
  return api<FriendRequestView[]>('/social/friends/requests/incoming', {
    method: 'GET',
    accessToken,
  });
}

export function fetchOutgoingFriendRequests(accessToken: string) {
  return api<FriendRequestView[]>('/social/friends/requests/outgoing', {
    method: 'GET',
    accessToken,
  });
}

export function acceptFriendRequest(accessToken: string, requestId: number) {
  return api<FriendRequestView>(`/social/friends/requests/${requestId}/accept`, {
    method: 'POST',
    accessToken,
  });
}

export function declineFriendRequest(accessToken: string, requestId: number) {
  return api<FriendRequestView>(`/social/friends/requests/${requestId}/decline`, {
    method: 'POST',
    accessToken,
  });
}

export function cancelFriendRequest(accessToken: string, requestId: number) {
  return api<{ ok: boolean }>(`/social/friends/requests/${requestId}`, {
    method: 'DELETE',
    accessToken,
  });
}

export function fetchSocialInboxSummary(accessToken: string) {
  return api<SocialInboxSummary>('/social/inbox/summary', {
    method: 'GET',
    accessToken,
  });
}

export function removeFriend(accessToken: string, userId: number) {
  return api<{ ok: boolean }>(`/social/friends/${userId}`, {
    method: 'DELETE',
    accessToken,
  });
}

export function fetchUserRelation(accessToken: string, userId: number) {
  return api<UserRelationView>(`/social/users/${userId}/relation`, {
    method: 'GET',
    accessToken,
  });
}

export function fetchConversations(accessToken: string) {
  return api<ConversationPreview[]>('/social/messages/conversations', {
    method: 'GET',
    accessToken,
  });
}

export function fetchMessagesWith(
  accessToken: string,
  userId: number,
  sinceMessageId?: number,
) {
  const qs =
    sinceMessageId != null ? `?since=${encodeURIComponent(String(sinceMessageId))}` : '';
  return api<DirectMessageView[]>(`/social/messages/with/${userId}${qs}`, {
    method: 'GET',
    accessToken,
  });
}

export function fetchSentMessageReceipts(accessToken: string, userId: number) {
  return api<MessageReadReceipt[]>(`/social/messages/with/${userId}/receipts`, {
    method: 'GET',
    accessToken,
  });
}

export function sendDirectMessage(accessToken: string, userId: number, body: string) {
  return api<DirectMessageView>(`/social/messages/with/${userId}`, {
    method: 'POST',
    accessToken,
    json: { body },
  });
}

export function markMessagesRead(accessToken: string, userId: number) {
  return api<{ updated: number }>('/social/messages/read', {
    method: 'PATCH',
    accessToken,
    json: { userId },
  });
}
