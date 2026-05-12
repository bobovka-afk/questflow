import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Character } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';


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
}
