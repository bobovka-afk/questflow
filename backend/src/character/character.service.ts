import {
  BadRequestException,
  ConflictException,
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
  DAILY_TASK_XP_COMPLETIONS_MAX,
  HP_GAIN_PER_XP_EVENT,
  XP_DAILY_CHECKIN,
} from '../gamification/config/rewards';
import {
  CharacterAvatarPreset,
  GenderCharacter,
  XpEventType,
} from '../generated/prisma/enums';
import {
  genderForAvatarPreset,
  isQuestAvatarPreset,
} from './config/quest-avatar-presets';
import {
  DEFAULT_GAME_DAY_TZ,
  XP_EVENT_TYPES_REQUIRING_DAY_KEY,
} from '../gamification/constants';
import { getTodayGameDayKey } from '../gamification/core/game-day';
import { QuestProgressService } from '../gamification/quest/quest-progress.service';
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

@Injectable()
export class CharacterService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private questProgressService: QuestProgressService,
    private achievementService: AchievementService,
    private socialService: SocialService,
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
      await this.assertAvatarPresetUpdateAllowed(
        userId,
        dto.avatarPreset,
        nextGender,
      );
    } else if (dto.gender !== undefined && isQuestAvatarPreset(existing.avatarPreset)) {
      this.assertAvatarPresetMatchesGender(existing.avatarPreset, nextGender);
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
    const timeZone =
      this.configService.get<string>('GAME_DAY_TZ') ?? DEFAULT_GAME_DAY_TZ;
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
          dailyTaskXpCount: true,
          health: true,
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
        eventType === XpEventType.TASK_COMPLETED &&
        userStats.dailyTaskXpCount >= DAILY_TASK_XP_COMPLETIONS_MAX
      ) {
        this.throwDailyTaskXpLimit();
      }

      const rewards: XpGrantRewards = {
        taskXp: 0,
        checkinXp: 0,
        hpGained: 0,
        checkinStreak: userStats.checkinStreak,
        previousCheckinStreak: userStats.checkinStreak,
        streakIncreased: false,
        streakMilestoneXp: 0,
        streakMilestonesReached: [],
      };

      const grantHp = eventType === XpEventType.TASK_COMPLETED;
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
        },
        stats,
        grantHp,
      );

      if (eventType === XpEventType.TASK_COMPLETED) {
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
        checkinStreak: stats.checkinStreak,
        lastCheckinDayKey: stats.lastCheckinDayKey,
      };
      if (eventType === XpEventType.TASK_COMPLETED) {
        data.dailyTaskXpCount = { increment: 1 };
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
    return (
      this.configService.get<string>('GAME_DAY_TZ') ?? DEFAULT_GAME_DAY_TZ
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
    if (isQuestAvatarPreset(avatarPreset)) {
      throw new BadRequestException({
        code: 'AVATAR_PRESET_QUEST_NOT_ON_CREATE',
        message: 'Quest avatar presets cannot be used when creating a character',
      });
    }
    this.assertAvatarPresetMatchesGender(avatarPreset, gender);
  }

  private async assertAvatarPresetUpdateAllowed(
    userId: number,
    avatarPreset: CharacterAvatarPreset,
    gender: GenderCharacter,
  ): Promise<void> {
    this.assertAvatarPresetMatchesGender(avatarPreset, gender);
    if (!isQuestAvatarPreset(avatarPreset)) {
      return;
    }
    const owned = await this.prisma.inventoryItem.findFirst({
      where: {
        userId,
        cosmeticItem: { key: avatarPreset },
      },
      select: { id: true },
    });
    if (!owned) {
      throw new ConflictException({
        code: 'COSMETIC_AVATAR_NOT_OWNED',
        message: 'Quest avatar preset is not owned',
      });
    }
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

  private throwDailyTaskXpLimit(): never {
    throw new ConflictException({
      code: 'DAILY_TASK_XP_LIMIT',
      message: 'Daily limit of task experience rewards reached',
    });
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
