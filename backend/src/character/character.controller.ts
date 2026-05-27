import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CharacterService } from './character.service';
import { QuestProgressService } from '../gamification/quest/quest-progress.service';
import { ChestService } from '../gamification/chest/chest.service';
import { DustService } from '../gamification/dust/dust.service';
import { AchievementService } from '../gamification/achievement/achievement.service';
import { EquipCosmeticDto } from './dto/equip-cosmetic.dto';
import { UnequipCosmeticDto } from './dto/unequip-cosmetic.dto';
import { PurchaseDustChestDto } from './dto/purchase-dust-chest.dto';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import type { AuthedRequest } from '../common/type';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import type { Character } from '../generated/prisma/client';

@ApiTags('character')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('character')
export class CharacterController {
  constructor(
    private readonly characterService: CharacterService,
    private readonly questProgressService: QuestProgressService,
    private readonly chestService: ChestService,
    private readonly dustService: DustService,
    private readonly achievementService: AchievementService,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user character' })
  @ApiResponse({ status: 200, description: 'Character returned.' })
  @ApiResponse({ status: 401, description: 'Authentication required.' })
  @ApiResponse({ status: 404, description: 'Character not found.' })
  async getCharacter(@Req() req: AuthedRequest): Promise<Character> {
    return this.characterService.getCharacter(req.user.id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get character by user id (any authenticated user)' })
  @ApiResponse({ status: 200, description: 'Character returned.' })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED'" })
  @ApiResponse({ status: 404, description: "code: 'CHARACTER_NOT_FOUND'" })
  async getCharacterByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Character> {
    return this.characterService.getCharacter(userId);
  }


  @Post()
  @ApiOperation({ summary: 'Create character (one per user)' })
  @ApiBody({ type: CreateCharacterDto })
  @ApiResponse({ status: 201, description: 'Character created.' })
  @ApiResponse({ status: 400, description: 'Validation or duplicate character.' })
  @ApiResponse({ status: 401, description: 'Authentication required.' })
  async createCharacter(
    @Req() req: AuthedRequest,
    @Body() dto: CreateCharacterDto,
  ): Promise<Character> {
    return this.characterService.createCharacter(req.user.id, dto);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user character' })
  @ApiBody({ type: UpdateCharacterDto })
  @ApiResponse({ status: 200, description: 'Character updated.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Authentication required.' })
  @ApiResponse({ status: 404, description: 'Character not found.' })
  async updateCharacter(
    @Req() req: AuthedRequest,
    @Body() dto: UpdateCharacterDto,
  ): Promise<Character> {
    return this.characterService.updateCharacter(req.user.id, dto);
  }

  @Post('checkin')
  @ApiOperation({ summary: 'Daily check-in (+100 XP, once per game day)' })
  @ApiResponse({ status: 200, description: 'Check-in completed, character updated.' })
  @ApiResponse({ status: 401, description: 'Authentication required.' })
  @ApiResponse({ status: 404, description: "code: 'CHARACTER_NOT_FOUND'" })
  @ApiResponse({
    status: 409,
    description: "code: 'CHECKIN_ALREADY_DONE' — already checked in today",
  })
  async dailyCheckin(@Req() req: AuthedRequest) {
    return this.characterService.dailyCheckin(req.user.id);
  }

  @Get('quests')
  @ApiOperation({ summary: 'Daily and weekly quest progress' })
  @ApiResponse({ status: 200, description: 'Quest list returned.' })
  async getQuests(@Req() req: AuthedRequest) {
    return this.questProgressService.getQuestsForUser(req.user.id);
  }

  @Get('chests')
  @ApiOperation({ summary: 'List user chests' })
  @ApiResponse({ status: 200, description: 'Chests returned.' })
  async getChests(@Req() req: AuthedRequest) {
    return this.chestService.listChests(req.user.id);
  }

  @Post('chests/:chestId/open')
  @ApiOperation({ summary: 'Open a chest and receive cosmetic loot' })
  @ApiResponse({ status: 200, description: 'Chest opened.' })
  @ApiResponse({ status: 404, description: "code: 'CHEST_NOT_FOUND'" })
  @ApiResponse({ status: 409, description: "code: 'CHEST_ALREADY_OPENED'" })
  async openChest(
    @Req() req: AuthedRequest,
    @Param('chestId', ParseIntPipe) chestId: number,
  ) {
    return this.chestService.openChest(req.user.id, chestId);
  }

  @Get('inventory')
  @ApiOperation({ summary: 'List owned cosmetics' })
  @ApiResponse({ status: 200, description: 'Inventory returned.' })
  async getInventory(@Req() req: AuthedRequest) {
    return this.chestService.listInventory(req.user.id);
  }

  @Patch('cosmetics/equip')
  @ApiOperation({ summary: 'Equip owned cosmetic (frame, background, badge)' })
  @ApiBody({ type: EquipCosmeticDto })
  @ApiResponse({ status: 200, description: 'Cosmetic equipped.' })
  @ApiResponse({ status: 404, description: "code: 'COSMETIC_NOT_OWNED'" })
  async equipCosmetic(
    @Req() req: AuthedRequest,
    @Body() dto: EquipCosmeticDto,
  ) {
    return this.chestService.equipCosmetic(req.user.id, dto.inventoryItemId);
  }

  @Patch('cosmetics/unequip')
  @ApiOperation({ summary: 'Unequip cosmetic (frame, background, badge)' })
  @ApiBody({ type: UnequipCosmeticDto })
  @ApiResponse({ status: 200, description: 'Cosmetic unequipped.' })
  @ApiResponse({ status: 400, description: "code: 'COSMETIC_NOT_EQUIPPED'" })
  @ApiResponse({ status: 404, description: "code: 'COSMETIC_NOT_OWNED'" })
  async unequipCosmetic(
    @Req() req: AuthedRequest,
    @Body() dto: UnequipCosmeticDto,
  ) {
    return this.chestService.unequipCosmetic(req.user.id, dto.inventoryItemId);
  }

  @Get('achievements')
  @ApiOperation({ summary: 'Achievement progress and unlocks' })
  @ApiResponse({ status: 200, description: 'Achievements returned.' })
  async getAchievements(@Req() req: AuthedRequest) {
    return this.achievementService.getAchievementsForUser(req.user.id);
  }

  @Get('dust/shop')
  @ApiOperation({ summary: 'Dust balance and chest shop (3 tiers)' })
  @ApiResponse({ status: 200, description: 'Shop returned.' })
  @ApiResponse({ status: 404, description: "code: 'CHARACTER_NOT_FOUND'" })
  async getDustShop(@Req() req: AuthedRequest) {
    return this.dustService.getShop(req.user.id);
  }

  @Post('dust/purchase')
  @ApiOperation({ summary: 'Buy a chest with dust' })
  @ApiBody({ type: PurchaseDustChestDto })
  @ApiResponse({ status: 201, description: 'Chest purchased.' })
  @ApiResponse({ status: 404, description: "code: 'CHARACTER_NOT_FOUND'" })
  @ApiResponse({ status: 409, description: "code: 'INSUFFICIENT_DUST'" })
  async purchaseDustChest(
    @Req() req: AuthedRequest,
    @Body() dto: PurchaseDustChestDto,
  ) {
    return this.dustService.purchaseChest(req.user.id, dto.tier);
  }
}
