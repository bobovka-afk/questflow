import type { ChestTier } from '@entities/quest';

export type BossCatalogItem = {
  key: string;
  nameRu: string;
  descriptionRu: string;
  chestTier: ChestTier;
};

export type PartyMemberView = {
  userId: number;
  name: string;
  characterName: string | null;
  role: 'LEADER' | 'MEMBER';
  status: 'INVITED' | 'ACTIVE' | 'KICKED' | 'LEFT' | 'DECLINED';
  contributionPct: number;
};

export type PartyRaidHitView = {
  id: number;
  userId: number;
  userName: string;
  damagePct: number;
  createdAt: string;
};

export type PartyKickVoteView = {
  id: number;
  targetUserId: number;
  initiatorId: number;
  status: string;
  approveCount: number;
  requiredCount: number;
};

export type PartyRaidView = {
  id: number;
  bossKey: string;
  bossNameRu: string;
  bossDescriptionRu: string;
  chestTier: ChestTier;
  leaderId: number;
  status: 'INVITING' | 'ACTIVE' | 'DEFEATED' | 'EXPIRED' | 'CANCELLED';
  remainingPct: number;
  damagePerAttack: number;
  activeMemberCount: number;
  startedAt: string | null;
  expiresAt: string | null;
  defeatedAt: string | null;
  members: PartyMemberView[];
  recentHits: PartyRaidHitView[];
  openKickVote: PartyKickVoteView | null;
  myRole: 'LEADER' | 'MEMBER' | null;
  myStatus: PartyMemberView['status'] | null;
  myContributionPct: number;
};

export type PartyMineView = {
  raid: PartyRaidView | null;
  pendingInvites: PartyRaidView[];
};
