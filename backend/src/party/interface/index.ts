import type { ChestTier } from '../../generated/prisma/enums';
import type {
  PartyMemberRole,
  PartyMemberStatus,
  PartyRaidStatus,
} from '../../generated/prisma/enums';

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
  role: PartyMemberRole;
  status: PartyMemberStatus;
  contributionPct: number;
};

export type PartyRaidHitView = {
  id: number;
  userId: number;
  userName: string;
  damagePct: number;
  createdAt: Date;
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
  status: PartyRaidStatus;
  remainingPct: number;
  damagePerAttack: number;
  activeMemberCount: number;
  startedAt: Date | null;
  expiresAt: Date | null;
  defeatedAt: Date | null;
  members: PartyMemberView[];
  recentHits: PartyRaidHitView[];
  openKickVote: PartyKickVoteView | null;
  myRole: PartyMemberRole | null;
  myStatus: PartyMemberStatus | null;
  myContributionPct: number;
};

export type PartyMineView = {
  raid: PartyRaidView | null;
  pendingInvites: PartyRaidView[];
};
