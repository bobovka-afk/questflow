import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, type Character } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { getRequiredXpForLevel } from './config/level-curve';
import { XpEventType } from '../generated/prisma/enums';


@Injectable()
export class CharacterService {
  constructor(private prisma: PrismaService) {}

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

    return this.prisma.character.update({
      where: { userId },
      data: {
        name: dto.name,
        gender: dto.gender,
        avatarPreset: dto.avatarPreset,
      },
    });
  }

  async addExperience(
    userId: number,
    xpAmount: number,
    eventType: XpEventType,
    cardId?: number | null,
  ): Promise<Character> {
    return this.prisma.$transaction(async (tx) => {
      const userStats = await tx.character.findUnique({
        where: { userId },
        select: {
          currentXp: true,
          level: true,
          dailyTaskXpCount: true
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
        userStats.dailyTaskXpCount >= 5
      ) {
        throw new ConflictException({
          code: 'DAILY_TASK_XP_LIMIT',
          message: 'Daily limit of task experience rewards reached',
        });
      }

      try {
        await tx.xpEvent.create({
          data: {
            userId,
            type: eventType,
            cardId: cardId ?? null,
            xpAmount,
          },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          throw new ConflictException({
            code: 'XP_EVENT_ALREADY_RECORDED',
            message: 'Experience for this action was already granted',
          });
        }
        throw error;
      }

      let level = userStats.level;
      let currentXp = userStats.currentXp;

      const requiredXp = getRequiredXpForLevel(userStats.level);
      if (xpAmount + currentXp >= requiredXp) {
        level += 1;
        currentXp = xpAmount + currentXp - requiredXp;
      } else {
        currentXp += xpAmount;
      }

      const data = { currentXp, level };
      if (eventType === XpEventType.TASK_COMPLETED) {
        Object.assign(data, { dailyTaskXpCount: { increment: 1 } });
      }

      return tx.character.update({
        where: { userId },
        data,
      });
    });
  }
}
