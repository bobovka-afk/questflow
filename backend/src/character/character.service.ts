import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, type Character } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { getRequiredXpForLevel } from './config/level-curve';
import { computeCheckinStreakAfterGrant } from '../gamification/core/checkin-streak';
import {
  getNewlyReachedStreakMilestones,
  streakMilestoneDayKey,
} from '../gamification/core/checkin-streak-milestones';
import {
  CHARACTER_HEALTH_MAX,
  DAILY_ACTIVITY_XP_MAX,
  HP_GAIN_PER_XP_EVENT,
  MANA_MAX,
  MANA_PER_TASK_COMPLETED,
  XP_DAILY_CHECKIN,
} from '../gamification/config/rewards';
import {
  CharacterAvatarPreset,
  GenderCharacter,
  XpEventType,
} from '../generated/prisma/enums';
import { genderForAvatarPreset, isQuestAvatarPresetKey } from './lib/avatar-preset-gender';
import {
  XP_EVENT_TYPES_REQUIRING_DAY_KEY,
} from '../gamification/constants';
import { getTodayGameDayKey } from '../gamification/core/game-day';
import { isDailyActivityXpEvent, isTaskLikeXpEvent } from '../gamification/core/task-like-xp-events';
import { resolveGameDayTimeZone } from '../gamification/lib/resolve-game-day-timezone';
import { QuestProgressService } from '../gamification/quest/quest-progress.service';
import { buildXpGainNotificationPayload } from '../gamification/xp/xp-gain-notification-payload';
import { AchievementService } from '../gamification/achievement/achievement.service';
import { AchievementMetric } from '../generated/prisma/enums';
import type {
  CharacterXpStats,
  XpGrantEventInput,
  XpGrantResult,
  XpGrantRewards,
  XpGrantTransaction,
} from '../gamification/xp/interface';
import { SocialService } from '../social/social.service';
import { UserService } from '../user/user.service';
import { UserSettingsService } from '../user-settings/user-settings.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class CharacterService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private questProgressService: QuestProgressService,
    private achievementService: AchievementService,
    private socialService: SocialService,
    private userService: UserService,
    private userSettingsService: UserSettingsService,
    private notificationService: NotificationService,
  ) {}

  async getCharacter(userId: number): Promise<Character> {
    const character = await this.prisma.character.findUnique({
      where: { userId },
    });
    if (!character) {
      throw new NotFoundException({
        code: 'CHARACTER_NOT_FOUND',
        message: 'Character not found',
      });
    }
    return character;
  }

  async getCharacterForViewerByUserId(
    targetUserId: number,
    viewerUserId: number,
  ): Promise<Character> {
    if (targetUserId === viewerUserId) {
      return this.getCharacter(viewerUserId);
    }

    await this.userService.assertProfileAccess(targetUserId, viewerUserId);
    const privacy = await this.userSettingsService.getPrivacySettings(targetUserId);
    if (!privacy.allowCharacterView) {
      throw new ForbiddenException({
        code: 'CHARACTER_VIEW_DISABLED',
        message: 'This user has disabled character viewing',
      });
    }

    return this.getCharacter(targetUserId);
  }

  async getCharacterForViewer(targetCharacterId: number): Promise<Character> {
    const targetCharacter = await this.prisma.character.findUnique({
      where: { id: targetCharacterId },
    });
    if (!targetCharacter) {
      throw new NotFoundException({
        code: 'CHARACTER_NOT_FOUND',
        message: 'Character not found',
      });
    }

    return targetCharacter;
  }

  async createCharacter(userId: number, dto: CreateCharacterDto): Promise<Character> {
    const existingCharacter = await this.prisma.character.findUnique({
      where: { userId },
    });
    if (existingCharacter) {
      throw new BadRequestException({
        code: 'CHARACTER_ALREADY_EXISTS',
        message: 'Character already exists',
      });
    }
    this.assertAvatarPresetAllowedForCreate(dto.avatarPreset, dto.gender);
    const friendCode = await this.socialService.generateUniqueFriendCode();
    const character = await this.prisma.character.create({
      data: {
        userId,
        name: dto.name,
        gender: dto.gender,
        avatarPreset: dto.avatarPreset,
        friendCode,
      },
    });
    return character;
  }

  async updateCharacter(userId: number, dto: UpdateCharacterDto): Promise<Character> {
    if (
      dto.name === undefined &&
      dto.gender === undefined &&
      dto.avatarPreset === undefined
    ) {
      throw new BadRequestException({
        code: 'CHARACTER_UPDATE_FIELDS_REQUIRED',
        message: 'Provide at least one field to update',
      });
    }

    const existing = await this.prisma.character.findUnique({
      where: { userId },
    });
    if (!existing) {
      throw new NotFoundException({
        code: 'CHARACTER_NOT_FOUND',
        message: 'Character not found',
      });
    }

    const nextGender = dto.gender ?? existing.gender;
    if (dto.avatarPreset !== undefined) {
      await this.assertAvatarPresetUpdateAllowed(dto.avatarPreset, nextGender);
    }

    return this.prisma.character.update({
      where: { userId },
      data: {
        name: dto.name,
        gender: dto.gender,
        avatarPreset: dto.avatarPreset,
      },
    });
  }

  async dailyCheckin(userId: number): Promise<XpGrantResult> {
    const timeZone = this.getGameDayTimeZone();
    const dayKey = getTodayGameDayKey(timeZone);
    return this.addExperience(
      userId,
      XP_DAILY_CHECKIN,
      XpEventType.DAILY_CHECKIN,
      null,
      dayKey,
    );
  }

  async addExperience(
    userId: number,
    xpAmount: number,
    eventType: XpEventType,
    cardId?: number | null,
    dayKey?: Date | null,
    personalRef?: {
      personalTodoId?: number | null;
      personalDailyId?: number | null;
      personalHabitId?: number | null;
    },
  ): Promise<XpGrantResult> {
    if (XP_EVENT_TYPES_REQUIRING_DAY_KEY.includes(eventType) && !dayKey) {
      this.throwXpEventDayKeyRequired();
    }

    const timeZone = this.getGameDayTimeZone();

    const result = await this.prisma.$transaction(async (tx) => {
      const userStats = await tx.character.findUnique({
        where: { userId },
        select: {
          currentXp: true,
          level: true,
          dailyActivityXpEarned: true,
          health: true,
          manaCurrent: true,
          checkinStreak: true,
          lastCheckinDayKey: true,
        },
      });
      if (!userStats) {
        throw new NotFoundException({
          code: 'CHARACTER_NOT_FOUND',
          message: 'Character not found',
        });
      }

      if (
        isDailyActivityXpEvent(eventType) &&
        userStats.dailyActivityXpEarned + xpAmount > DAILY_ACTIVITY_XP_MAX
      ) {
        this.throwDailyActivityXpLimit();
      }

      const rewards: XpGrantRewards = {
        taskXp: 0,
        checkinXp: 0,
        hpGained: 0,
        manaGained: 0,
        checkinStreak: userStats.checkinStreak,
        previousCheckinStreak: userStats.checkinStreak,
        streakIncreased: false,
        streakMilestoneXp: 0,
        streakMilestonesReached: [],
      };

      const grantHp = isTaskLikeXpEvent(eventType) || eventType === XpEventType.HABIT_POSITIVE;
      const healthBefore = userStats.health;
      let stats: CharacterXpStats = { ...userStats };

      stats = await this.recordXpEventAndApply(
        tx,
        userId,
        {
          type: eventType,
          xpAmount,
          cardId: cardId ?? null,
          dayKey: dayKey ?? null,
          personalTodoId: personalRef?.personalTodoId ?? null,
          personalDailyId: personalRef?.personalDailyId ?? null,
          personalHabitId: personalRef?.personalHabitId ?? null,
        },
        stats,
        grantHp,
      );

      if (isTaskLikeXpEvent(eventType)) {
        rewards.taskXp = xpAmount;
        const manaRoom = Math.max(0, MANA_MAX - stats.manaCurrent);
        const manaGained = Math.min(MANA_PER_TASK_COMPLETED, manaRoom);
        stats.manaCurrent += manaGained;
        rewards.manaGained = manaGained;
      } else if (eventType === XpEventType.HABIT_POSITIVE) {
        rewards.taskXp = xpAmount;
      } else if (eventType === XpEventType.DAILY_CHECKIN) {
        rewards.checkinXp = xpAmount;
        stats = await this.applyCheckinStreakAndMilestones(
          tx,
          userId,
          stats,
          timeZone,
          rewards,
          dayKey ?? undefined,
        );
      }

      if (grantHp) {
        rewards.hpGained = stats.health - healthBefore;
      }

      if (eventType !== XpEventType.DAILY_CHECKIN) {
        const autoResult = await this.grantAutoDailyCheckinIfNeeded(
          tx,
          userId,
          stats,
          timeZone,
          rewards,
        );
        stats = autoResult.stats;
        Object.assign(rewards, autoResult.rewards);
      }

      const data: Prisma.CharacterUpdateInput = {
        currentXp: stats.currentXp,
        level: stats.level,
        health: stats.health,
        manaCurrent: stats.manaCurrent,
        checkinStreak: stats.checkinStreak,
        lastCheckinDayKey: stats.lastCheckinDayKey,
      };
      if (isDailyActivityXpEvent(eventType)) {
        data.dailyActivityXpEarned = { increment: xpAmount };
      }

      const character = await tx.character.update({
        where: { userId },
        data,
      });

      rewards.checkinStreak = character.checkinStreak;

      return { character, rewards };
    });

    await this.applyQuestProgressAfterXp(userId, result.rewards, dayKey ?? null);
    await this.achievementService.recordMax(
      userId,
      AchievementMetric.CHARACTER_LEVEL,
      result.character.level,
    );
    await this.achievementService.recordMax(
      userId,
      AchievementMetric.CHECKIN_STREAK_MAX,
      result.character.checkinStreak,
    );

    const xpPayload = buildXpGainNotificationPayload(result.rewards, eventType);
    if (xpPayload) {
      await this.notificationService.notifyXpGain(userId, xpPayload);
    }

    return result;
  }

  private async applyQuestProgressAfterXp(
    userId: number,
    rewards: XpGrantRewards,
    dayKey: Date | null,
  ): Promise<void> {
    const tz = this.getGameDayTimeZone();
    const key = dayKey ?? getTodayGameDayKey(tz);
    await this.questProgressService.recordXpDay(userId, key);
    if (rewards.checkinXp > 0) {
      await this.questProgressService.recordDailyCheckin(userId);
    }
  }

  private applyXpToStats(
    stats: CharacterXpStats,
    xpAmount: number,
    grantHp: boolean,
  ): CharacterXpStats {
    let { level, currentXp, health } = stats;
    const requiredXp = getRequiredXpForLevel(level);
    if (xpAmount + currentXp >= requiredXp) {
      level += 1;
      currentXp = xpAmount + currentXp - requiredXp;
    } else {
      currentXp += xpAmount;
    }
    if (grantHp) {
      health = Math.min(CHARACTER_HEALTH_MAX, health + HP_GAIN_PER_XP_EVENT);
    }
    return { ...stats, level, currentXp, health };
  }

  private async applyCheckinStreakAndMilestones(
    tx: XpGrantTransaction,
    userId: number,
    stats: CharacterXpStats,
    timeZone: string,
    rewards: XpGrantRewards,
    checkinDayKey?: Date,
  ): Promise<CharacterXpStats> {
    const todayKey = checkinDayKey ?? getTodayGameDayKey(timeZone);
    const streakUpdate = computeCheckinStreakAfterGrant(
      todayKey,
      stats.lastCheckinDayKey,
      stats.checkinStreak,
      timeZone,
    );
    rewards.previousCheckinStreak = streakUpdate.previousCheckinStreak;
    rewards.streakIncreased = streakUpdate.streakIncreased;
    rewards.checkinStreak = streakUpdate.checkinStreak;

    let nextStats: CharacterXpStats = {
      ...stats,
      checkinStreak: streakUpdate.checkinStreak,
      lastCheckinDayKey: todayKey,
    };

    if (streakUpdate.streakIncreased) {
      nextStats = await this.grantStreakMilestonesIfNeeded(
        tx,
        userId,
        nextStats,
        streakUpdate.previousCheckinStreak,
        streakUpdate.checkinStreak,
        rewards,
      );
    }

    return nextStats;
  }

  private async grantStreakMilestonesIfNeeded(
    tx: XpGrantTransaction,
    userId: number,
    stats: CharacterXpStats,
    previousStreak: number,
    newStreak: number,
    rewards: XpGrantRewards,
  ): Promise<CharacterXpStats> {
    const milestones = getNewlyReachedStreakMilestones(previousStreak, newStreak);
    let currentStats = stats;

    for (const milestone of milestones) {
      const dayKey = streakMilestoneDayKey(milestone.days);
      const existing = await tx.xpEvent.findFirst({
        where: {
          userId,
          type: XpEventType.CHECKIN_STREAK,
          dayKey,
        },
        select: { id: true },
      });
      if (existing) {
        continue;
      }

      currentStats = await this.recordXpEventAndApply(
        tx,
        userId,
        {
          type: XpEventType.CHECKIN_STREAK,
          xpAmount: milestone.xp,
          cardId: null,
          dayKey,
        },
        currentStats,
        false,
      );
      rewards.streakMilestoneXp += milestone.xp;
      rewards.streakMilestonesReached.push(milestone.days);
    }

    return currentStats;
  }

  private async recordXpEventAndApply(
    tx: XpGrantTransaction,
    userId: number,
    event: XpGrantEventInput,
    stats: CharacterXpStats,
    grantHp: boolean,
  ): Promise<CharacterXpStats> {
    try {
      await tx.xpEvent.create({
        data: {
          userId,
          type: event.type,
          cardId: event.cardId,
          personalTodoId: event.personalTodoId ?? null,
          personalDailyId: event.personalDailyId ?? null,
          personalHabitId: event.personalHabitId ?? null,
          dayKey: event.dayKey,
          xpAmount: event.xpAmount,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        this.throwXpEventDuplicate(event.type);
      }
      throw error;
    }

    return this.applyXpToStats(stats, event.xpAmount, grantHp);
  }

  private getGameDayTimeZone(): string {
    return resolveGameDayTimeZone(
      this.configService.get<string>('GAME_DAY_TZ'),
    );
  }

  private async grantAutoDailyCheckinIfNeeded(
    tx: XpGrantTransaction,
    userId: number,
    stats: CharacterXpStats,
    timeZone: string,
    rewards: XpGrantRewards,
  ): Promise<{ stats: CharacterXpStats; rewards: XpGrantRewards }> {
    const dayKey = getTodayGameDayKey(timeZone);
    const existing = await tx.xpEvent.findFirst({
      where: {
        userId,
        type: XpEventType.DAILY_CHECKIN,
        dayKey,
      },
      select: { id: true },
    });
    if (existing) {
      return { stats, rewards };
    }

    const nextStats = await this.recordXpEventAndApply(
      tx,
      userId,
      {
        type: XpEventType.DAILY_CHECKIN,
        xpAmount: XP_DAILY_CHECKIN,
        cardId: null,
        dayKey,
      },
      stats,
      false,
    );

    rewards.checkinXp += XP_DAILY_CHECKIN;
    const withStreak = await this.applyCheckinStreakAndMilestones(
      tx,
      userId,
      nextStats,
      timeZone,
      rewards,
      dayKey,
    );

    return { stats: withStreak, rewards };
  }

  private assertAvatarPresetAllowedForCreate(
    avatarPreset: CharacterAvatarPreset,
    gender: GenderCharacter,
  ): void {
    if (isQuestAvatarPresetKey(avatarPreset)) {
      throw new BadRequestException({
        code: 'AVATAR_PRESET_INVALID',
        message: 'This avatar preset cannot be used',
      });
    }
    this.assertAvatarPresetMatchesGender(avatarPreset, gender);
  }

  private async assertAvatarPresetUpdateAllowed(
    avatarPreset: CharacterAvatarPreset,
    gender: GenderCharacter,
  ): Promise<void> {
    if (isQuestAvatarPresetKey(avatarPreset)) {
      throw new BadRequestException({
        code: 'AVATAR_PRESET_INVALID',
        message: 'This avatar preset cannot be used',
      });
    }
    this.assertAvatarPresetMatchesGender(avatarPreset, gender);
  }

  private assertAvatarPresetMatchesGender(
    avatarPreset: CharacterAvatarPreset,
    gender: GenderCharacter,
  ): void {
    if (genderForAvatarPreset(avatarPreset) !== gender) {
      throw new BadRequestException({
        code: 'CHARACTER_AVATAR_GENDER_MISMATCH',
        message: 'Avatar preset does not match character gender',
      });
    }
  }

  private throwXpEventDayKeyRequired(): never {
    throw new BadRequestException({
      code: 'XP_EVENT_DAY_KEY_REQUIRED',
      message: 'dayKey is required for this experience event type',
    });
  }

  private throwDailyActivityXpLimit(): never {
    throw new ConflictException({
      code: 'DAILY_ACTIVITY_XP_LIMIT',
      message: 'Daily limit of activity experience rewards reached',
    });
  }

  async applyHealthDelta(userId: number, delta: number): Promise<number> {
    const character = await this.prisma.character.findUnique({
      where: { userId },
      select: { health: true },
    });
    if (!character) {
      throw new NotFoundException({
        code: 'CHARACTER_NOT_FOUND',
        message: 'Character not found',
      });
    }
    const health = Math.max(0, Math.min(CHARACTER_HEALTH_MAX, character.health + delta));
    await this.prisma.character.update({
      where: { userId },
      data: { health },
    });
    return health;
  }

  private throwXpEventDuplicate(eventType: XpEventType): never {
    if (eventType === XpEventType.DAILY_CHECKIN) {
      throw new ConflictException({
        code: 'CHECKIN_ALREADY_DONE',
        message: 'Daily check-in was already completed for today',
      });
    }
    throw new ConflictException({
      code: 'XP_EVENT_ALREADY_RECORDED',
      message: 'Experience for this action was already granted',
    });
  }
}
