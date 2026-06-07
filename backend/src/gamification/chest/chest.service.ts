import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import type { ChestTier, CosmeticType } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import {
  cosmeticTypeToCharacterField,
  rollLootCosmeticKey,
} from '../config/loot-table';
import {
  parseBossKeyFromChestSource,
  rollBossLootCosmeticKey,
} from '../config/boss-loot-table';
import { DUST_FOR_DUPLICATE_BY_TIER } from '../config/dust';
import { AchievementService } from '../achievement/achievement.service';
import { AchievementMetric } from '../../generated/prisma/enums';

export type GrantChestResult = {
  chestId: number;
  created: boolean;
};

export type OpenChestResult = {
  chestId: number;
  cosmeticKey: string;
  cosmeticNameRu: string;
  cosmeticType: CosmeticType;
  cosmeticTier: ChestTier;
  alreadyOwned: boolean;
  inventoryItemId: number | null;
  dustGranted: number;
  dustBalance: number;
};

@Injectable()
export class ChestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly achievementService: AchievementService,
  ) {}

  buildQuestChestSource(templateId: number, periodKey: string): string {
    return `QUEST:${templateId}:${periodKey}`;
  }

  async grantChest(
    tx: Prisma.TransactionClient,
    userId: number,
    tier: ChestTier,
    source: string,
  ): Promise<GrantChestResult> {
    const existing = await tx.userChest.findUnique({
      where: { userId_source: { userId, source } },
    });
    if (existing) {
      return { chestId: existing.id, created: false };
    }

    const chest = await tx.userChest.create({
      data: { userId, tier, source },
    });
    return { chestId: chest.id, created: true };
  }

  async openChest(userId: number, chestId: number): Promise<OpenChestResult> {
    const result = await this.prisma.$transaction(async (tx) => {
      const chest = await tx.userChest.findFirst({
        where: { id: chestId, userId },
      });
      if (!chest) {
        throw new NotFoundException({
          code: 'CHEST_NOT_FOUND',
          message: 'Chest not found',
        });
      }
      if (chest.openedAt) {
        throw new ConflictException({
          code: 'CHEST_ALREADY_OPENED',
          message: 'Chest already opened',
        });
      }

      const characterRow = await tx.character.findUnique({
        where: { userId },
        select: { gender: true },
      });
      if (!characterRow) {
        throw new NotFoundException({
          code: 'CHARACTER_NOT_FOUND',
          message: 'Character not found',
        });
      }

      const bossKey = parseBossKeyFromChestSource(chest.source);
      const cosmeticKey =
        bossKey != null
          ? rollBossLootCosmeticKey(bossKey, chest.tier, characterRow.gender)
          : rollLootCosmeticKey(chest.tier, characterRow.gender);
      const cosmetic = await tx.cosmeticItem.findUnique({
        where: { key: cosmeticKey },
      });
      if (!cosmetic) {
        throw new NotFoundException({
          code: 'COSMETIC_NOT_FOUND',
          message: 'Cosmetic not found',
        });
      }

      const existingItem = await tx.inventoryItem.findUnique({
        where: {
          userId_cosmeticItemId: {
            userId,
            cosmeticItemId: cosmetic.id,
          },
        },
      });

      let inventoryItemId: number | null = null;
      const alreadyOwned = Boolean(existingItem);
      let dustGranted = 0;

      if (!existingItem) {
        const item = await tx.inventoryItem.create({
          data: {
            userId,
            cosmeticItemId: cosmetic.id,
          },
        });
        inventoryItemId = item.id;
      } else {
        dustGranted = DUST_FOR_DUPLICATE_BY_TIER[cosmetic.tier];
      }

      const character = await tx.character.update({
        where: { userId },
        data: alreadyOwned ? { dust: { increment: dustGranted } } : {},
        select: { dust: true },
      });

      await tx.userChest.update({
        where: { id: chestId },
        data: { openedAt: new Date() },
      });

      return {
        chestId,
        cosmeticKey: cosmetic.key,
        cosmeticNameRu: cosmetic.nameRu,
        cosmeticType: cosmetic.type,
        cosmeticTier: cosmetic.tier,
        alreadyOwned,
        inventoryItemId,
        dustGranted,
        dustBalance: character.dust,
      };
    });

    if (result.dustGranted > 0) {
      await this.achievementService.recordIncrement(
        userId,
        AchievementMetric.DUST_EARNED_TOTAL,
        result.dustGranted,
      );
    }
    if (!result.alreadyOwned) {
      await this.achievementService.recordCosmeticsOwnedCount(userId);
    }

    return result;
  }

  async listChests(userId: number) {
    return this.prisma.userChest.findMany({
      where: { userId },
      orderBy: [{ openedAt: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async listInventory(userId: number) {
    return this.prisma.inventoryItem.findMany({
      where: { userId },
      include: { cosmeticItem: true },
      orderBy: { obtainedAt: 'desc' },
    });
  }

  async equipCosmetic(
    userId: number,
    cosmeticItemId: number,
  ): Promise<{ equipped: boolean }> {
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.inventoryItem.findFirst({
        where: { id: cosmeticItemId, userId },
        include: { cosmeticItem: true },
      });
      if (!item) {
        throw new NotFoundException({
          code: 'COSMETIC_NOT_OWNED',
          message: 'Cosmetic not owned',
        });
      }

      const field = cosmeticTypeToCharacterField(item.cosmeticItem.type);
      if (!field) {
        throw new ConflictException({
          code: 'COSMETIC_EQUIP_NOT_SUPPORTED',
          message: 'This cosmetic type cannot be equipped here',
        });
      }

      await tx.inventoryItem.updateMany({
        where: {
          userId,
          cosmeticItem: { type: item.cosmeticItem.type },
        },
        data: { equipped: false },
      });

      await tx.inventoryItem.update({
        where: { id: cosmeticItemId },
        data: { equipped: true },
      });

      await tx.character.update({
        where: { userId },
        data: { [field]: item.cosmeticItem.key },
      });

      return { equipped: true };
    });
  }

  async unequipCosmetic(
    userId: number,
    inventoryItemId: number,
  ): Promise<{ equipped: boolean }> {
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.inventoryItem.findFirst({
        where: { id: inventoryItemId, userId },
        include: { cosmeticItem: true },
      });
      if (!item) {
        throw new NotFoundException({
          code: 'COSMETIC_NOT_OWNED',
          message: 'Cosmetic not owned',
        });
      }

      const field = cosmeticTypeToCharacterField(item.cosmeticItem.type);
      if (!field) {
        throw new ConflictException({
          code: 'COSMETIC_EQUIP_NOT_SUPPORTED',
          message: 'This cosmetic type cannot be equipped here',
        });
      }

      if (!item.equipped) {
        throw new BadRequestException({
          code: 'COSMETIC_NOT_EQUIPPED',
          message: 'This cosmetic is not equipped',
        });
      }

      await tx.inventoryItem.update({
        where: { id: inventoryItemId },
        data: { equipped: false },
      });

      await tx.character.update({
        where: { userId },
        data: { [field]: null },
      });

      return { equipped: false };
    });
  }
}
