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
var GamificationCronService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamificationCronService = exports.RESET_DAILY_TASK_XP_CRON_EXPRESSION = exports.RESET_DAILY_TASK_XP_CRON_NAME = exports.DEFAULT_GAME_DAY_TZ = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const cron_1 = require("cron");
const client_1 = require("../generated/prisma/client");
const enums_1 = require("../generated/prisma/enums");
const prisma_service_1 = require("../prisma/prisma.service");
const constants_1 = require("./constants");
const rewards_1 = require("./config/rewards");
const game_day_1 = require("./game-day");
const inactivity_1 = require("./inactivity");
var constants_2 = require("./constants");
Object.defineProperty(exports, "DEFAULT_GAME_DAY_TZ", { enumerable: true, get: function () { return constants_2.DEFAULT_GAME_DAY_TZ; } });
exports.RESET_DAILY_TASK_XP_CRON_NAME = 'resetDailyTaskXpCounts';
exports.RESET_DAILY_TASK_XP_CRON_EXPRESSION = '0 0 * * *';
let GamificationCronService = GamificationCronService_1 = class GamificationCronService {
    prisma;
    configService;
    schedulerRegistry;
    logger = new common_1.Logger(GamificationCronService_1.name);
    constructor(prisma, configService, schedulerRegistry) {
        this.prisma = prisma;
        this.configService = configService;
        this.schedulerRegistry = schedulerRegistry;
    }
    onModuleInit() {
        const timeZone = this.getGameDayTimeZone();
        const job = new cron_1.CronJob(exports.RESET_DAILY_TASK_XP_CRON_EXPRESSION, () => {
            void this.runMidnightGamificationJobs();
        }, null, true, timeZone);
        this.schedulerRegistry.addCronJob(exports.RESET_DAILY_TASK_XP_CRON_NAME, job);
        this.logger.log(`Scheduled ${exports.RESET_DAILY_TASK_XP_CRON_NAME} at 00:00 (${timeZone})`);
    }
    getGameDayTimeZone() {
        return (this.configService.get('GAME_DAY_TZ') ?? constants_1.DEFAULT_GAME_DAY_TZ);
    }
    async runMidnightGamificationJobs() {
        await this.resetDailyTaskXpCounts();
        await this.applyInactivityHpPenalty();
    }
    async resetDailyTaskXpCounts() {
        const result = await this.prisma.character.updateMany({
            where: { dailyTaskXpCount: { gt: 0 } },
            data: { dailyTaskXpCount: 0 },
        });
        this.logger.log(`Reset dailyTaskXpCount for ${result.count} character(s)`);
        return { count: result.count };
    }
    async applyInactivityHpPenalty() {
        const timeZone = this.getGameDayTimeZone();
        const yesterdayKey = (0, game_day_1.getYesterdayGameDayKey)(timeZone);
        const graceCutoff = new Date(Date.now() - rewards_1.CHARACTER_GRACE_PERIOD_MS);
        const characters = await this.prisma.character.findMany({
            where: { health: { gt: 0 } },
            select: {
                id: true,
                userId: true,
                health: true,
                createdAt: true,
            },
        });
        let penalized = 0;
        let skippedActive = 0;
        let skippedGrace = 0;
        for (const character of characters) {
            if (character.createdAt >= graceCutoff) {
                skippedGrace++;
                continue;
            }
            const active = await (0, inactivity_1.wasUserActiveOnGameDay)(this.prisma, character.userId, yesterdayKey, timeZone);
            if (active) {
                skippedActive++;
                continue;
            }
            const applied = await this.applyPenaltyForCharacter(character.id, character.userId, character.health, yesterdayKey);
            if (applied) {
                penalized++;
            }
        }
        this.logger.log(`Inactivity HP penalty for ${yesterdayKey.toISOString().slice(0, 10)}: ` +
            `${penalized} penalized, ${skippedActive} active, ${skippedGrace} in grace`);
        return { penalized, skippedActive, skippedGrace };
    }
    async applyPenaltyForCharacter(characterId, userId, currentHealth, inactiveDayKey) {
        const newHealth = Math.max(0, currentHealth - rewards_1.HP_INACTIVITY_PENALTY);
        try {
            await this.prisma.$transaction(async (tx) => {
                await tx.healthEvent.create({
                    data: {
                        userId,
                        dayKey: inactiveDayKey,
                        delta: -rewards_1.HP_INACTIVITY_PENALTY,
                        reason: enums_1.HealthEventReason.INACTIVITY_PENALTY,
                    },
                });
                await tx.character.update({
                    where: { id: characterId },
                    data: { health: newHealth },
                });
            });
            return true;
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                return false;
            }
            throw error;
        }
    }
};
exports.GamificationCronService = GamificationCronService;
exports.GamificationCronService = GamificationCronService = GamificationCronService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        schedule_1.SchedulerRegistry])
], GamificationCronService);
//# sourceMappingURL=gamification-cron.service.js.map