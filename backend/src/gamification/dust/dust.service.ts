import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ChestTier } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { ChestService } from '../chest/chest.service';
import {
  DUST_CHEST_SHOP_OPTIONS,
  DUST_FOR_DUPLICATE_BY_TIER,
} from '../config/dust';
import type {
  DustShopView,
  PurchaseChestWithDustResult,
} from './interface/dust.interface';

@Injectable()
export class DustService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chestService: ChestService,
  ) {}

  getDuplicateDustAmount(cosmeticTier: ChestTier): number {
    return DUST_FOR_DUPLICATE_BY_TIER[cosmeticTier];
  }

  async grantDuplicateDust(
    userId: number,
    cosmeticTier: ChestTier,
  ): Promise<{ dustGranted: number; dustBalance: number }> {
    const dustGranted = this.getDuplicateDustAmount(cosmeticTier);
    const character = await this.prisma.character.update({
      where: { userId },
      data: { dust: { increment: dustGranted } },
      select: { dust: true },
    });
    return { dustGranted, dustBalance: character.dust };
  }

  async getShop(userId: number): Promise<DustShopView> {
    const character = await this.prisma.character.findUnique({
      where: { userId },
      select: { dust: true },
    });
    if (!character) {
      throw new NotFoundException({
        code: 'CHARACTER_NOT_FOUND',
        message: 'Character not found',
      });
    }

    return {
      balance: character.dust,
      options: DUST_CHEST_SHOP_OPTIONS.map((option) => ({
        tier: option.tier,
        cost: option.cost,
        titleRu: option.titleRu,
        descriptionRu: option.descriptionRu,
        canAfford: character.dust >= option.cost,
      })),
    };
  }

  async purchaseChest(
    userId: number,
    tier: ChestTier,
  ): Promise<PurchaseChestWithDustResult> {
    const option = DUST_CHEST_SHOP_OPTIONS.find((o) => o.tier === tier);
    if (!option) {
      throw new BadRequestException({
        code: 'DUST_SHOP_TIER_INVALID',
        message: 'Invalid chest tier for dust shop',
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const character = await tx.character.findUnique({
        where: { userId },
        select: { dust: true },
      });
      if (!character) {
        throw new NotFoundException({
          code: 'CHARACTER_NOT_FOUND',
          message: 'Character not found',
        });
      }
      if (character.dust < option.cost) {
        throw new ConflictException({
          code: 'INSUFFICIENT_DUST',
          message: 'Not enough dust',
        });
      }

      const updated = await tx.character.update({
        where: { userId },
        data: { dust: character.dust - option.cost },
        select: { dust: true },
      });

      const source = `DUST:${Date.now()}:${Math.random().toString(36).slice(2, 10)}`;
      const grant = await this.chestService.grantChest(
        tx,
        userId,
        tier,
        source,
      );

      return {
        chestId: grant.chestId,
        tier,
        dustSpent: option.cost,
        dustBalance: updated.dust,
      };
    });
  }
}
