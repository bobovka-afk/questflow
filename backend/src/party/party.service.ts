import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  FriendRequestStatus,
  Prisma,
} from '../generated/prisma/client';
import {
  PartyKickVoteStatus,
  PartyMemberRole,
  PartyMemberStatus,
  PartyRaidStatus,
} from '../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import { ChestService } from '../gamification/chest/chest.service';
import {
  BOSS_ATTACK_MANA_COST,
  BOSS_MAX_PARTY_SIZE,
  BOSS_MIN_CONTRIBUTION_PCT_FOR_LOOT,
  BOSS_MIN_PARTY_SIZE,
  BOSS_RAID_TTL_DAYS,
  MANA_MAX,
  MAX_ACTIVE_RAIDS_PER_USER,
  PARTY_AFK_INACTIVE_MS,
} from '../gamification/config/rewards';
import { NotificationService } from '../notification/notification.service';
import { UserNotificationType } from '../generated/prisma/enums';
import { UserBlockService } from '../user/user-block.service';
import { BOSS_TEMPLATES, getBossTemplate } from './config/boss-templates';
import { buildBossChestSource, calcDamagePerAttack } from './lib/boss-damage';
import type {
  BossCatalogItem,
  PartyKickVoteView,
  PartyMineView,
  PartyRaidHitView,
  PartyRaidView,
} from './interface';

const memberUserSelect = {
  id: true,
  name: true,
  character: { select: { name: true } },
} satisfies Prisma.UserSelect;

type RaidWithMembers = Prisma.PartyRaidGetPayload<{
  include: {
    members: { include: { user: { select: typeof memberUserSelect } } };
    hits: {
      include: { user: { select: typeof memberUserSelect } };
      orderBy: { createdAt: 'desc' };
      take: 20;
    };
    kickVotes: {
      where: { status: 'OPEN' };
      include: { ballots: true };
      take: 1;
    };
  };
}>;

@Injectable()
export class PartyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chestService: ChestService,
    private readonly notificationService: NotificationService,
    private readonly userBlockService: UserBlockService,
  ) {}

  listBosses(): BossCatalogItem[] {
    return BOSS_TEMPLATES.map((b) => ({
      key: b.key,
      nameRu: b.nameRu,
      descriptionRu: b.descriptionRu,
      chestTier: b.chestTier,
    }));
  }

  async createRaid(
    leaderId: number,
    bossKey: string,
    friendUserIds: number[],
  ): Promise<PartyRaidView> {
    const boss = getBossTemplate(bossKey);
    if (!boss) {
      throw new NotFoundException({
        code: 'BOSS_NOT_FOUND',
        message: 'Boss not found',
      });
    }

    const uniqueFriends = [...new Set(friendUserIds)].filter((id) => id !== leaderId);
    if (uniqueFriends.length === 0) {
      throw new BadRequestException({
        code: 'PARTY_INVITE_EMPTY',
        message: 'Select at least one friend',
      });
    }
    if (uniqueFriends.length + 1 > BOSS_MAX_PARTY_SIZE) {
      throw new BadRequestException({
        code: 'PARTY_SIZE_EXCEEDED',
        message: `Party cannot exceed ${BOSS_MAX_PARTY_SIZE} members`,
      });
    }

    await this.assertNoActiveRaidMembership(leaderId);

    for (const friendId of uniqueFriends) {
      await this.userBlockService.assertNotBlocked(leaderId, friendId);
      const isFriend = await this.areFriends(leaderId, friendId);
      if (!isFriend) {
        throw new ForbiddenException({
          code: 'PARTY_NOT_FRIEND',
          message: 'You can only invite friends to a raid',
        });
      }
      await this.assertNoActiveRaidMembership(friendId);
    }

    const raid = await this.prisma.partyRaid.create({
      data: {
        bossKey,
        leaderId,
        status: PartyRaidStatus.INVITING,
        members: {
          create: [
            {
              userId: leaderId,
              role: PartyMemberRole.LEADER,
              status: PartyMemberStatus.ACTIVE,
              joinedAt: new Date(),
            },
            ...uniqueFriends.map((userId) => ({
              userId,
              role: PartyMemberRole.MEMBER,
              status: PartyMemberStatus.INVITED,
            })),
          ],
        },
      },
    });

    const bossName = boss.nameRu;
    for (const friendId of uniqueFriends) {
      await this.notificationService.create(
        friendId,
        UserNotificationType.PARTY_RAID_INVITE,
        { raidId: raid.id, bossKey, bossNameRu: bossName, leaderId },
      );
    }

    return this.getRaidView(leaderId, raid.id);
  }

  async getMine(userId: number): Promise<PartyMineView> {
    await this.expireStaleRaids();

    const memberships = await this.prisma.partyRaidMember.findMany({
      where: {
        userId,
        status: {
          in: [
            PartyMemberStatus.INVITED,
            PartyMemberStatus.ACTIVE,
          ],
        },
        raid: {
          status: {
            in: [PartyRaidStatus.INVITING, PartyRaidStatus.ACTIVE],
          },
        },
      },
      include: { raid: true },
      orderBy: { createdAt: 'desc' },
    });

    let activeRaid: PartyRaidView | null = null;
    const pendingInvites: PartyRaidView[] = [];

    for (const m of memberships) {
      const view = await this.getRaidView(userId, m.raidId);
      if (m.status === PartyMemberStatus.ACTIVE) {
        activeRaid = view;
      } else if (m.status === PartyMemberStatus.INVITED) {
        pendingInvites.push(view);
      }
    }

    return { raid: activeRaid, pendingInvites };
  }

  async getRaid(userId: number, raidId: number): Promise<PartyRaidView> {
    await this.expireStaleRaids();
    await this.assertRaidMember(userId, raidId);
    return this.getRaidView(userId, raidId);
  }

  async acceptInvite(userId: number, raidId: number): Promise<PartyRaidView> {
    await this.assertNoActiveRaidMembership(userId, raidId);
    const member = await this.getMemberRow(raidId, userId);
    if (member.status !== PartyMemberStatus.INVITED) {
      throw new ConflictException({
        code: 'PARTY_INVITE_NOT_PENDING',
        message: 'Invite is not pending',
      });
    }
    const raid = await this.prisma.partyRaid.findUnique({ where: { id: raidId } });
    if (!raid || raid.status !== PartyRaidStatus.INVITING) {
      throw new ConflictException({
        code: 'PARTY_RAID_NOT_INVITING',
        message: 'Raid is not accepting invites',
      });
    }

    await this.prisma.partyRaidMember.update({
      where: { id: member.id },
      data: {
        status: PartyMemberStatus.ACTIVE,
        joinedAt: new Date(),
      },
    });

    return this.getRaidView(userId, raidId);
  }

  async declineInvite(userId: number, raidId: number): Promise<void> {
    const member = await this.getMemberRow(raidId, userId);
    if (member.status !== PartyMemberStatus.INVITED) {
      throw new ConflictException({
        code: 'PARTY_INVITE_NOT_PENDING',
        message: 'Invite is not pending',
      });
    }
    await this.prisma.partyRaidMember.update({
      where: { id: member.id },
      data: { status: PartyMemberStatus.DECLINED },
    });
  }

  async startRaid(userId: number, raidId: number): Promise<PartyRaidView> {
    const raid = await this.getRaidRow(raidId);
    if (raid.leaderId !== userId) {
      throw new ForbiddenException({
        code: 'PARTY_NOT_LEADER',
        message: 'Only the leader can start the raid',
      });
    }
    if (raid.status !== PartyRaidStatus.INVITING) {
      throw new ConflictException({
        code: 'PARTY_RAID_NOT_INVITING',
        message: 'Raid cannot be started',
      });
    }

    const activeCount = this.countActiveMembers(raid);
    if (activeCount < BOSS_MIN_PARTY_SIZE) {
      throw new BadRequestException({
        code: 'PARTY_TOO_SMALL',
        message: `At least ${BOSS_MIN_PARTY_SIZE} members required to start`,
      });
    }

    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + BOSS_RAID_TTL_DAYS);

    await this.prisma.partyRaid.update({
      where: { id: raidId },
      data: {
        status: PartyRaidStatus.ACTIVE,
        startedAt: now,
        expiresAt,
        remainingPct: 100,
      },
    });

    return this.getRaidView(userId, raidId);
  }

  async attack(userId: number, raidId: number): Promise<PartyRaidView> {
    await this.expireStaleRaids();

    const result = await this.prisma.$transaction(async (tx) => {
      const raid = await tx.partyRaid.findUnique({
        where: { id: raidId },
        include: { members: true },
      });
      if (!raid) {
        throw new NotFoundException({
          code: 'PARTY_RAID_NOT_FOUND',
          message: 'Raid not found',
        });
      }
      if (raid.status !== PartyRaidStatus.ACTIVE) {
        throw new ConflictException({
          code: 'PARTY_RAID_NOT_ACTIVE',
          message: 'Raid is not active',
        });
      }

      const member = raid.members.find((m) => m.userId === userId);
      if (!member || member.status !== PartyMemberStatus.ACTIVE) {
        throw new ForbiddenException({
          code: 'PARTY_NOT_ACTIVE_MEMBER',
          message: 'You are not an active raid member',
        });
      }

      const character = await tx.character.findUnique({
        where: { userId },
        select: { manaCurrent: true },
      });
      if (!character) {
        throw new NotFoundException({
          code: 'CHARACTER_NOT_FOUND',
          message: 'Character not found',
        });
      }
      if (character.manaCurrent < BOSS_ATTACK_MANA_COST) {
        throw new ConflictException({
          code: 'MANA_INSUFFICIENT',
          message: 'Not enough mana for an attack',
        });
      }

      const activeCount = this.countActiveMembers(raid);
      const damage = calcDamagePerAttack(activeCount);
      const newRemaining = Math.max(0, raid.remainingPct - damage);

      await tx.character.update({
        where: { userId },
        data: { manaCurrent: { decrement: BOSS_ATTACK_MANA_COST } },
      });

      await tx.partyRaidHit.create({
        data: { raidId, userId, damagePct: damage },
      });

      await tx.partyRaidMember.update({
        where: { id: member.id },
        data: { contributionPct: { increment: damage } },
      });

      const defeated = newRemaining <= 0;
      await tx.partyRaid.update({
        where: { id: raidId },
        data: {
          remainingPct: newRemaining,
          ...(defeated
            ? {
                status: PartyRaidStatus.DEFEATED,
                defeatedAt: new Date(),
                remainingPct: 0,
              }
            : {}),
        },
      });

      return { defeated, bossKey: raid.bossKey };
    });

    if (result.defeated) {
      await this.grantBossLoot(raidId, result.bossKey);
    }

    return this.getRaidView(userId, raidId);
  }

  async kickMember(
    leaderId: number,
    raidId: number,
    targetUserId: number,
  ): Promise<PartyRaidView> {
    const raid = await this.getRaidRow(raidId);
    if (raid.leaderId !== leaderId) {
      throw new ForbiddenException({
        code: 'PARTY_NOT_LEADER',
        message: 'Only the leader can kick members',
      });
    }
    if (targetUserId === leaderId) {
      throw new BadRequestException({
        code: 'PARTY_CANNOT_KICK_LEADER',
        message: 'Leader cannot be kicked',
      });
    }
    if (raid.status !== PartyRaidStatus.INVITING && raid.status !== PartyRaidStatus.ACTIVE) {
      throw new ConflictException({
        code: 'PARTY_RAID_NOT_ACTIVE',
        message: 'Raid is not active',
      });
    }

    await this.removeMember(raidId, targetUserId, PartyMemberStatus.KICKED);
    return this.getRaidView(leaderId, raidId);
  }

  async createKickVote(
    userId: number,
    raidId: number,
    targetUserId: number,
  ): Promise<PartyRaidView> {
    const raid = await this.getRaidRow(raidId);
    if (raid.status !== PartyRaidStatus.ACTIVE) {
      throw new ConflictException({
        code: 'PARTY_RAID_NOT_ACTIVE',
        message: 'Voting is only available during active raids',
      });
    }
    if (targetUserId === raid.leaderId) {
      throw new BadRequestException({
        code: 'PARTY_CANNOT_KICK_LEADER',
        message: 'Leader cannot be kicked',
      });
    }
    await this.assertRaidMember(userId, raidId);
    const target = await this.getMemberRow(raidId, targetUserId);
    if (target.status !== PartyMemberStatus.ACTIVE) {
      throw new BadRequestException({
        code: 'PARTY_TARGET_NOT_ACTIVE',
        message: 'Target is not an active member',
      });
    }

    const existing = await this.prisma.partyKickVote.findFirst({
      where: {
        raidId,
        targetUserId,
        status: PartyKickVoteStatus.OPEN,
      },
    });
    if (existing) {
      throw new ConflictException({
        code: 'PARTY_KICK_VOTE_OPEN',
        message: 'A kick vote is already open for this member',
      });
    }

    const vote = await this.prisma.partyKickVote.create({
      data: {
        raidId,
        targetUserId,
        initiatorId: userId,
      },
    });

    await this.prisma.partyKickBallot.create({
      data: { voteId: vote.id, voterId: userId },
    });

    await this.tryResolveKickVote(vote.id);
    return this.getRaidView(userId, raidId);
  }

  async voteKick(
    userId: number,
    raidId: number,
    voteId: number,
  ): Promise<PartyRaidView> {
    const vote = await this.prisma.partyKickVote.findUnique({
      where: { id: voteId },
      include: { ballots: true },
    });
    if (!vote || vote.raidId !== raidId) {
      throw new NotFoundException({
        code: 'PARTY_KICK_VOTE_NOT_FOUND',
        message: 'Kick vote not found',
      });
    }
    if (vote.status !== PartyKickVoteStatus.OPEN) {
      throw new ConflictException({
        code: 'PARTY_KICK_VOTE_CLOSED',
        message: 'Kick vote is closed',
      });
    }
    if (vote.targetUserId === userId) {
      throw new ForbiddenException({
        code: 'PARTY_CANNOT_VOTE_ON_SELF',
        message: 'You cannot vote to kick yourself',
      });
    }

    await this.assertRaidMember(userId, raidId);
    const member = await this.getMemberRow(raidId, userId);
    if (member.status !== PartyMemberStatus.ACTIVE) {
      throw new ForbiddenException({
        code: 'PARTY_NOT_ACTIVE_MEMBER',
        message: 'Only active members can vote',
      });
    }

    const already = vote.ballots.some((b) => b.voterId === userId);
    if (!already) {
      await this.prisma.partyKickBallot.create({
        data: { voteId, voterId: userId },
      });
    }

    await this.tryResolveKickVote(voteId);
    return this.getRaidView(userId, raidId);
  }

  async cancelRaid(userId: number, raidId: number): Promise<void> {
    const raid = await this.getRaidRow(raidId);
    if (raid.leaderId !== userId) {
      throw new ForbiddenException({
        code: 'PARTY_NOT_LEADER',
        message: 'Only the leader can cancel the raid',
      });
    }
    if (raid.status !== PartyRaidStatus.INVITING) {
      throw new ConflictException({
        code: 'PARTY_RAID_NOT_INVITING',
        message: 'Only inviting raids can be cancelled',
      });
    }
    await this.prisma.partyRaid.update({
      where: { id: raidId },
      data: { status: PartyRaidStatus.CANCELLED },
    });
  }

  private async grantBossLoot(raidId: number, bossKey: string): Promise<void> {
    const boss = getBossTemplate(bossKey);
    if (!boss) return;

    const members = await this.prisma.partyRaidMember.findMany({
      where: {
        raidId,
        status: PartyMemberStatus.ACTIVE,
        contributionPct: { gte: BOSS_MIN_CONTRIBUTION_PCT_FOR_LOOT },
      },
    });

    const source = buildBossChestSource(bossKey, raidId);
    for (const member of members) {
      await this.prisma.$transaction(async (tx) => {
        await this.chestService.grantChest(tx, member.userId, boss.chestTier, source);
      });
    }
  }

  private async tryResolveKickVote(voteId: number): Promise<void> {
    const vote = await this.prisma.partyKickVote.findUnique({
      where: { id: voteId },
      include: { ballots: true },
    });
    if (!vote || vote.status !== PartyKickVoteStatus.OPEN) return;

    const raid = await this.getRaidRow(vote.raidId);
    const activeMembers = raid.members.filter(
      (m) =>
        m.status === PartyMemberStatus.ACTIVE && m.userId !== vote.targetUserId,
    );
    const required = Math.floor(activeMembers.length / 2) + 1;
    const approveCount = vote.ballots.length;

    if (approveCount >= required) {
      await this.prisma.partyKickVote.update({
        where: { id: voteId },
        data: {
          status: PartyKickVoteStatus.PASSED,
          resolvedAt: new Date(),
        },
      });
      await this.removeMember(vote.raidId, vote.targetUserId, PartyMemberStatus.KICKED);
    }
  }

  private async removeMember(
    raidId: number,
    userId: number,
    status: typeof PartyMemberStatus.KICKED | typeof PartyMemberStatus.LEFT,
  ): Promise<void> {
    const member = await this.getMemberRow(raidId, userId);
    if (
      member.status !== PartyMemberStatus.ACTIVE &&
      member.status !== PartyMemberStatus.INVITED
    ) {
      return;
    }
    await this.prisma.partyKickVote.updateMany({
      where: {
        raidId,
        targetUserId: userId,
        status: PartyKickVoteStatus.OPEN,
      },
      data: {
        status: PartyKickVoteStatus.REJECTED,
        resolvedAt: new Date(),
      },
    });
    await this.prisma.partyRaidMember.update({
      where: { id: member.id },
      data: { status },
    });
  }

  private async getRaidView(userId: number, raidId: number): Promise<PartyRaidView> {
    const raid = await this.loadRaid(raidId);
    const boss = getBossTemplate(raid.bossKey);
    if (!boss) {
      throw new NotFoundException({
        code: 'BOSS_NOT_FOUND',
        message: 'Boss not found',
      });
    }

    const activeCount = this.countActiveMembers(raid);
    const myMember = raid.members.find((m) => m.userId === userId);

    const openVote = raid.kickVotes[0];
    let openKickVote: PartyKickVoteView | null = null;
    if (openVote) {
      const activeMembers = raid.members.filter(
        (m) =>
          m.status === PartyMemberStatus.ACTIVE &&
          m.userId !== openVote.targetUserId,
      );
      openKickVote = {
        id: openVote.id,
        targetUserId: openVote.targetUserId,
        initiatorId: openVote.initiatorId,
        status: openVote.status,
        approveCount: openVote.ballots.length,
        requiredCount: Math.floor(activeMembers.length / 2) + 1,
      };
    }

    return {
      id: raid.id,
      bossKey: raid.bossKey,
      bossNameRu: boss.nameRu,
      bossDescriptionRu: boss.descriptionRu,
      chestTier: boss.chestTier,
      leaderId: raid.leaderId,
      status: raid.status,
      remainingPct: raid.remainingPct,
      damagePerAttack: calcDamagePerAttack(activeCount),
      activeMemberCount: activeCount,
      startedAt: raid.startedAt,
      expiresAt: raid.expiresAt,
      defeatedAt: raid.defeatedAt,
      members: raid.members.map((m) => ({
        userId: m.userId,
        name: m.user.name,
        characterName: m.user.character?.name ?? null,
        role: m.role,
        status: m.status,
        contributionPct: m.contributionPct,
      })),
      recentHits: raid.hits.map(
        (h): PartyRaidHitView => ({
          id: h.id,
          userId: h.userId,
          userName: h.user.name,
          damagePct: h.damagePct,
          createdAt: h.createdAt,
        }),
      ),
      openKickVote,
      myRole: myMember?.role ?? null,
      myStatus: myMember?.status ?? null,
      myContributionPct: myMember?.contributionPct ?? 0,
    };
  }

  private async loadRaid(raidId: number): Promise<RaidWithMembers> {
    const raid = await this.prisma.partyRaid.findUnique({
      where: { id: raidId },
      include: {
        members: {
          include: { user: { select: memberUserSelect } },
          orderBy: { createdAt: 'asc' },
        },
        hits: {
          include: { user: { select: memberUserSelect } },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        kickVotes: {
          where: { status: PartyKickVoteStatus.OPEN },
          include: { ballots: true },
          take: 1,
        },
      },
    });
    if (!raid) {
      throw new NotFoundException({
        code: 'PARTY_RAID_NOT_FOUND',
        message: 'Raid not found',
      });
    }
    return raid;
  }

  private countActiveMembers(
    raid: { members: Array<{ status: PartyMemberStatus }> },
  ): number {
    return raid.members.filter((m) => m.status === PartyMemberStatus.ACTIVE)
      .length;
  }

  private async getRaidRow(raidId: number) {
    const raid = await this.prisma.partyRaid.findUnique({
      where: { id: raidId },
      include: { members: true },
    });
    if (!raid) {
      throw new NotFoundException({
        code: 'PARTY_RAID_NOT_FOUND',
        message: 'Raid not found',
      });
    }
    return raid;
  }

  private async getMemberRow(raidId: number, userId: number) {
    const member = await this.prisma.partyRaidMember.findUnique({
      where: { raidId_userId: { raidId, userId } },
    });
    if (!member) {
      throw new NotFoundException({
        code: 'PARTY_MEMBER_NOT_FOUND',
        message: 'You are not a member of this raid',
      });
    }
    return member;
  }

  private async assertRaidMember(userId: number, raidId: number): Promise<void> {
    await this.getMemberRow(raidId, userId);
  }

  private async assertNoActiveRaidMembership(
    userId: number,
    exceptRaidId?: number,
  ): Promise<void> {
    const activeCount = await this.prisma.partyRaidMember.count({
      where: {
        userId,
        status: {
          in: [PartyMemberStatus.INVITED, PartyMemberStatus.ACTIVE],
        },
        raid: {
          status: {
            in: [PartyRaidStatus.INVITING, PartyRaidStatus.ACTIVE],
          },
          ...(exceptRaidId != null ? { id: { not: exceptRaidId } } : {}),
        },
      },
    });
    if (activeCount >= MAX_ACTIVE_RAIDS_PER_USER) {
      throw new ConflictException({
        code: 'PARTY_RAID_ALREADY_ACTIVE',
        message: `You can be in at most ${MAX_ACTIVE_RAIDS_PER_USER} active raids`,
      });
    }
  }

  private async expireStaleRaids(): Promise<void> {
    const now = new Date();
    await this.kickAfkMembers(now);
    await this.prisma.partyRaid.updateMany({
      where: {
        status: PartyRaidStatus.ACTIVE,
        expiresAt: { lt: now },
      },
      data: { status: PartyRaidStatus.EXPIRED },
    });
  }

  private async kickAfkMembers(now: Date): Promise<void> {
    const cutoff = new Date(now.getTime() - PARTY_AFK_INACTIVE_MS);
    const activeMembers = await this.prisma.partyRaidMember.findMany({
      where: {
        status: PartyMemberStatus.ACTIVE,
        role: PartyMemberRole.MEMBER,
        raid: { status: PartyRaidStatus.ACTIVE },
      },
      select: { id: true, raidId: true, userId: true, joinedAt: true },
    });

    for (const member of activeMembers) {
      const lastHit = await this.prisma.partyRaidHit.findFirst({
        where: { raidId: member.raidId, userId: member.userId },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      });
      const lastActive = lastHit?.createdAt ?? member.joinedAt;
      if (lastActive && lastActive >= cutoff) {
        continue;
      }
      await this.prisma.partyRaidMember.update({
        where: { id: member.id },
        data: { status: PartyMemberStatus.KICKED },
      });
    }
  }

  private async areFriends(userA: number, userB: number): Promise<boolean> {
    const row = await this.prisma.friendRequest.findFirst({
      where: {
        status: FriendRequestStatus.ACCEPTED,
        OR: [
          { requesterId: userA, addresseeId: userB },
          { requesterId: userB, addresseeId: userA },
        ],
      },
    });
    return Boolean(row);
  }
}
