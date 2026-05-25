import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
export { DEFAULT_GAME_DAY_TZ } from './constants';
export declare const RESET_DAILY_TASK_XP_CRON_NAME = "resetDailyTaskXpCounts";
export declare const RESET_DAILY_TASK_XP_CRON_EXPRESSION = "0 0 * * *";
export declare class GamificationCronService implements OnModuleInit {
    private readonly prisma;
    private readonly configService;
    private readonly schedulerRegistry;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService, schedulerRegistry: SchedulerRegistry);
    onModuleInit(): void;
    getGameDayTimeZone(): string;
    runMidnightGamificationJobs(): Promise<void>;
    resetDailyTaskXpCounts(): Promise<{
        count: number;
    }>;
    applyInactivityHpPenalty(): Promise<{
        penalized: number;
        skippedActive: number;
        skippedGrace: number;
    }>;
    private applyPenaltyForCharacter;
}
