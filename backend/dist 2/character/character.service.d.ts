import { ConfigService } from '@nestjs/config';
import { type Character } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { XpEventType } from '../generated/prisma/enums';
import type { XpGrantResult } from '../gamification/interface';
export declare class CharacterService {
    private prisma;
    private configService;
    constructor(prisma: PrismaService, configService: ConfigService);
    getCharacter(userId: number): Promise<Character>;
    getCharacterForViewer(targetCharacterId: number): Promise<Character>;
    createCharacter(userId: number, dto: CreateCharacterDto): Promise<Character>;
    updateCharacter(userId: number, dto: UpdateCharacterDto): Promise<Character>;
    dailyCheckin(userId: number): Promise<XpGrantResult>;
    addExperience(userId: number, xpAmount: number, eventType: XpEventType, cardId?: number | null, dayKey?: Date | null): Promise<XpGrantResult>;
    private applyXpToStats;
    private applyCheckinStreakAndMilestones;
    private grantStreakMilestonesIfNeeded;
    private recordXpEventAndApply;
    private getGameDayTimeZone;
    private grantAutoDailyCheckinIfNeeded;
}
