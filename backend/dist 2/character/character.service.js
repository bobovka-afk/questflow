"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("../generated/prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const level_curve_1 = require("./config/level-curve");
const checkin_streak_1 = require("../gamification/checkin-streak");
const checkin_streak_milestones_1 = require("../gamification/checkin-streak-milestones");
const rewards_1 = require("../gamification/config/rewards");
const enums_1 = require("../generated/prisma/enums");
const constants_1 = require("../gamification/constants");
const game_day_1 = require("../gamification/game-day");
const errors_1 = require("../gamification/errors");
let CharacterService = class CharacterService {
    prisma;
    configService;
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
    }
    async getCharacter(userId) {
        const character = await this.prisma.character.findUnique({
            where: { userId },
        });
        if (!character) {
            throw new common_1.NotFoundException({
                code: 'CHARACTER_NOT_FOUND',
                message: 'Character not found',
            });
        }
        return character;
    }
    async getCharacterForViewer(targetCharacterId) {
        const targetCharacter = await this.prisma.character.findUnique({
            where: { id: targetCharacterId },
        });
        if (!targetCharacter) {
            throw new common_1.NotFoundException({
                code: 'CHARACTER_NOT_FOUND',
                message: 'Character not found',
            });
        }
        return targetCharacter;
    }
    async createCharacter(userId, dto) {
        const existingCharacter = await this.prisma.character.findUnique({
            where: { userId },
        });
        if (existingCharacter) {
            throw new common_1.BadRequestException({
                code: 'CHARACTER_ALREADY_EXISTS',
                message: 'Character already exists',
            });
        }
        const character = await this.prisma.character.create({
            data: {
                userId,
                name: dto.name,
                gender: dto.gender,
                avatarPreset: dto.avatarPreset,
            },
        });
        return character;
    }
    async updateCharacter(userId, dto) {
        if (dto.name === undefined &&
            dto.gender === undefined &&
            dto.avatarPreset === undefined) {
            throw new common_1.BadRequestException({
                code: 'CHARACTER_UPDATE_FIELDS_REQUIRED',
                message: 'Provide at least one field to update',
            });
        }
        const existing = await this.prisma.character.findUnique({
            where: { userId },
        });
        if (!existing) {
            throw new common_1.NotFoundException({
                code: 'CHARACTER_NOT_FOUND',
                message: 'Character not found',
            });
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
    async dailyCheckin(userId) {
        const timeZone = this.configService.get('GAME_DAY_TZ') ?? constants_1.DEFAULT_GAME_DAY_TZ;
        const dayKey = (0, game_day_1.getTodayGameDayKey)(timeZone);
        return this.addExperience(userId, rewards_1.XP_DAILY_CHECKIN, enums_1.XpEventType.DAILY_CHECKIN, null, dayKey);
    }
    async addExperience(userId, xpAmount, eventType, cardId, dayKey) {
        if (constants_1.XP_EVENT_TYPES_REQUIRING_DAY_KEY.includes(eventType) && !dayKey) {
            (0, errors_1.throwXpEventDayKeyRequired)();
        }
        const timeZone = this.getGameDayTimeZone();
        return this.prisma.$transaction(async (tx) => {
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
                throw new common_1.NotFoundException({
                    code: 'CHARACTER_NOT_FOUND',
                    message: 'Character not found',
                });
            }
            if (eventType === enums_1.XpEventType.TASK_COMPLETED &&
                userStats.dailyTaskXpCount >= rewards_1.DAILY_TASK_XP_COMPLETIONS_MAX) {
                (0, errors_1.throwDailyTaskXpLimit)();
            }
            const rewards = {
                taskXp: 0,
                checkinXp: 0,
                hpGained: 0,
                checkinStreak: userStats.checkinStreak,
                previousCheckinStreak: userStats.checkinStreak,
                streakIncreased: false,
                streakMilestoneXp: 0,
                streakMilestonesReached: [],
            };
            const grantHp = eventType === enums_1.XpEventType.TASK_COMPLETED;
            const healthBefore = userStats.health;
            let stats = { ...userStats };
            stats = await this.recordXpEventAndApply(tx, userId, {
                type: eventType,
                xpAmount,
                cardId: cardId ?? null,
                dayKey: dayKey ?? null,
            }, stats, grantHp);
            if (eventType === enums_1.XpEventType.TASK_COMPLETED) {
                rewards.taskXp = xpAmount;
            }
            else if (eventType === enums_1.XpEventType.DAILY_CHECKIN) {
                rewards.checkinXp = xpAmount;
                stats = await this.applyCheckinStreakAndMilestones(tx, userId, stats, timeZone, rewards, dayKey ?? undefined);
            }
            if (grantHp) {
                rewards.hpGained = stats.health - healthBefore;
            }
            if (eventType !== enums_1.XpEventType.DAILY_CHECKIN) {
                const autoResult = await this.grantAutoDailyCheckinIfNeeded(tx, userId, stats, timeZone, rewards);
                stats = autoResult.stats;
                Object.assign(rewards, autoResult.rewards);
            }
            const data = {
                currentXp: stats.currentXp,
                level: stats.level,
                health: stats.health,
                checkinStreak: stats.checkinStreak,
                lastCheckinDayKey: stats.lastCheckinDayKey,
            };
            if (eventType === enums_1.XpEventType.TASK_COMPLETED) {
                data.dailyTaskXpCount = { increment: 1 };
            }
            const character = await tx.character.update({
                where: { userId },
                data,
            });
            rewards.checkinStreak = character.checkinStreak;
            return { character, rewards };
        });
    }
    applyXpToStats(stats, xpAmount, grantHp) {
        let { level, currentXp, health } = stats;
        const requiredXp = (0, level_curve_1.getRequiredXpForLevel)(level);
        if (xpAmount + currentXp >= requiredXp) {
            level += 1;
            currentXp = xpAmount + currentXp - requiredXp;
        }
        else {
            currentXp += xpAmount;
        }
        if (grantHp) {
            health = Math.min(rewards_1.CHARACTER_HEALTH_MAX, health + rewards_1.HP_GAIN_PER_XP_EVENT);
        }
        return { ...stats, level, currentXp, health };
    }
    async applyCheckinStreakAndMilestones(tx, userId, stats, timeZone, rewards, checkinDayKey) {
        const todayKey = checkinDayKey ?? (0, game_day_1.getTodayGameDayKey)(timeZone);
        const streakUpdate = (0, checkin_streak_1.computeCheckinStreakAfterGrant)(todayKey, stats.lastCheckinDayKey, stats.checkinStreak, timeZone);
        rewards.previousCheckinStreak = streakUpdate.previousCheckinStreak;
        rewards.streakIncreased = streakUpdate.streakIncreased;
        rewards.checkinStreak = streakUpdate.checkinStreak;
        let nextStats = {
            ...stats,
            checkinStreak: streakUpdate.checkinStreak,
            lastCheckinDayKey: todayKey,
        };
        if (streakUpdate.streakIncreased) {
            nextStats = await this.grantStreakMilestonesIfNeeded(tx, userId, nextStats, streakUpdate.previousCheckinStreak, streakUpdate.checkinStreak, rewards);
        }
        return nextStats;
    }
    async grantStreakMilestonesIfNeeded(tx, userId, stats, previousStreak, newStreak, rewards) {
        const milestones = (0, checkin_streak_milestones_1.getNewlyReachedStreakMilestones)(previousStreak, newStreak);
        let currentStats = stats;
        for (const milestone of milestones) {
            const dayKey = (0, checkin_streak_milestones_1.streakMilestoneDayKey)(milestone.days);
            const existing = await tx.xpEvent.findFirst({
                where: {
                    userId,
                    type: enums_1.XpEventType.CHECKIN_STREAK,
                    dayKey,
                },
                select: { id: true },
            });
            if (existing) {
                continue;
            }
            currentStats = await this.recordXpEventAndApply(tx, userId, {
                type: enums_1.XpEventType.CHECKIN_STREAK,
                xpAmount: milestone.xp,
                cardId: null,
                dayKey,
            }, currentStats, false);
            rewards.streakMilestoneXp += milestone.xp;
            rewards.streakMilestonesReached.push(milestone.days);
        }
        return currentStats;
    }
    async recordXpEventAndApply(tx, userId, event, stats, grantHp) {
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
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                (0, errors_1.throwXpEventDuplicate)(event.type);
            }
            throw error;
        }
        return this.applyXpToStats(stats, event.xpAmount, grantHp);
    }
    getGameDayTimeZone() {
        return (this.configService.get('GAME_DAY_TZ') ?? constants_1.DEFAULT_GAME_DAY_TZ);
    }
    async grantAutoDailyCheckinIfNeeded(tx, userId, stats, timeZone, rewards) {
        const dayKey = (0, game_day_1.getTodayGameDayKey)(timeZone);
        const existing = await tx.xpEvent.findFirst({
            where: {
                userId,
                type: enums_1.XpEventType.DAILY_CHECKIN,
                dayKey,
            },
            select: { id: true },
        });
        if (existing) {
            return { stats, rewards };
        }
        const nextStats = await this.recordXpEventAndApply(tx, userId, {
            type: enums_1.XpEventType.DAILY_CHECKIN,
            xpAmount: rewards_1.XP_DAILY_CHECKIN,
            cardId: null,
            dayKey,
        }, stats, false);
        rewards.checkinXp += rewards_1.XP_DAILY_CHECKIN;
        const withStreak = await this.applyCheckinStreakAndMilestones(tx, userId, nextStats, timeZone, rewards, dayKey);
        return { stats: withStreak, rewards };
    }
};
exports.CharacterService = CharacterService;
exports.CharacterService = CharacterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], CharacterService);
//# sourceMappingURL=character.service.js.map