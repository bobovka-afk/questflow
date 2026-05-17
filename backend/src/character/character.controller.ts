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
  constructor(private readonly characterService: CharacterService) {}

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
}
