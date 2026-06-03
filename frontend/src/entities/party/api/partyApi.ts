import { api } from '@shared/api';
import type {
  BossCatalogItem,
  PartyMineView,
  PartyRaidView,
} from '../model/types';

export function fetchBossCatalog(accessToken: string) {
  return api<BossCatalogItem[]>('/party/bosses', { method: 'GET', accessToken });
}

export function fetchPartyMine(accessToken: string) {
  return api<PartyMineView>('/party/raids/mine', { method: 'GET', accessToken });
}

export function fetchPartyRaid(accessToken: string, raidId: number) {
  return api<PartyRaidView>(`/party/raids/${raidId}`, { method: 'GET', accessToken });
}

export function createPartyRaid(
  accessToken: string,
  bossKey: string,
  friendUserIds: number[],
) {
  return api<PartyRaidView>('/party/raids', {
    method: 'POST',
    accessToken,
    json: { bossKey, friendUserIds },
  });
}

export function acceptPartyInvite(accessToken: string, raidId: number) {
  return api<PartyRaidView>(`/party/raids/${raidId}/accept`, {
    method: 'POST',
    accessToken,
  });
}

export function declinePartyInvite(accessToken: string, raidId: number) {
  return api<void>(`/party/raids/${raidId}/decline`, {
    method: 'POST',
    accessToken,
  });
}

export function startPartyRaid(accessToken: string, raidId: number) {
  return api<PartyRaidView>(`/party/raids/${raidId}/start`, {
    method: 'POST',
    accessToken,
  });
}

export function attackPartyBoss(accessToken: string, raidId: number) {
  return api<PartyRaidView>(`/party/raids/${raidId}/attack`, {
    method: 'POST',
    accessToken,
  });
}

export function kickPartyMember(accessToken: string, raidId: number, userId: number) {
  return api<PartyRaidView>(`/party/raids/${raidId}/members/${userId}/kick`, {
    method: 'POST',
    accessToken,
  });
}

export function createPartyKickVote(
  accessToken: string,
  raidId: number,
  targetUserId: number,
) {
  return api<PartyRaidView>(`/party/raids/${raidId}/kick-votes`, {
    method: 'POST',
    accessToken,
    json: { targetUserId },
  });
}

export function votePartyKick(accessToken: string, raidId: number, voteId: number) {
  return api<PartyRaidView>(`/party/raids/${raidId}/kick-votes/${voteId}/vote`, {
    method: 'POST',
    accessToken,
  });
}

export function cancelPartyRaid(accessToken: string, raidId: number) {
  return api<void>(`/party/raids/${raidId}`, {
    method: 'DELETE',
    accessToken,
  });
}
