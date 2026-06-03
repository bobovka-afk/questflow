import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { RateLimit } from '../common/decorators/rate-limit.decorator';
import { RateLimitGuard } from '../common/guards/rate-limit.guard';
import type { AuthedRequest } from '../common/type';
import { PartyService } from './party.service';
import { CreatePartyRaidDto } from './dto/create-party-raid.dto';
import { CreateKickVoteDto } from './dto/create-kick-vote.dto';

@ApiTags('party')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('party')
export class PartyController {
  constructor(private readonly partyService: PartyService) {}

  @Get('bosses')
  @ApiOperation({ summary: 'Boss catalog for party raids' })
  listBosses() {
    return this.partyService.listBosses();
  }

  @Get('raids/mine')
  @ApiOperation({ summary: 'Current raid and pending invites' })
  getMine(@Req() req: AuthedRequest) {
    return this.partyService.getMine(req.user.id);
  }

  @Get('raids/:id')
  @ApiOperation({ summary: 'Raid details' })
  getRaid(@Req() req: AuthedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.partyService.getRaid(req.user.id, id);
  }

  @Post('raids')
  @UseGuards(RateLimitGuard)
  @RateLimit({ key: 'party:create-raid', limit: 5, windowSec: 300 })
  @ApiOperation({ summary: 'Create raid and invite friends' })
  @ApiBody({ type: CreatePartyRaidDto })
  @ApiResponse({ status: 409, description: "code: 'PARTY_RAID_ALREADY_ACTIVE'" })
  createRaid(@Req() req: AuthedRequest, @Body() dto: CreatePartyRaidDto) {
    return this.partyService.createRaid(
      req.user.id,
      dto.bossKey,
      dto.friendUserIds,
    );
  }

  @Post('raids/:id/accept')
  acceptInvite(@Req() req: AuthedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.partyService.acceptInvite(req.user.id, id);
  }

  @Post('raids/:id/decline')
  declineInvite(@Req() req: AuthedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.partyService.declineInvite(req.user.id, id);
  }

  @Post('raids/:id/start')
  startRaid(@Req() req: AuthedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.partyService.startRaid(req.user.id, id);
  }

  @Post('raids/:id/attack')
  @UseGuards(RateLimitGuard)
  @RateLimit({ key: 'party:attack', limit: 30, windowSec: 60 })
  @ApiResponse({ status: 409, description: "code: 'MANA_INSUFFICIENT'" })
  attack(@Req() req: AuthedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.partyService.attack(req.user.id, id);
  }

  @Post('raids/:id/members/:userId/kick')
  kickMember(
    @Req() req: AuthedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.partyService.kickMember(req.user.id, id, userId);
  }

  @Post('raids/:id/kick-votes')
  @ApiBody({ type: CreateKickVoteDto })
  createKickVote(
    @Req() req: AuthedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateKickVoteDto,
  ) {
    return this.partyService.createKickVote(req.user.id, id, dto.targetUserId);
  }

  @Post('raids/:id/kick-votes/:voteId/vote')
  voteKick(
    @Req() req: AuthedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Param('voteId', ParseIntPipe) voteId: number,
  ) {
    return this.partyService.voteKick(req.user.id, id, voteId);
  }

  @Delete('raids/:id')
  cancelRaid(@Req() req: AuthedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.partyService.cancelRaid(req.user.id, id);
  }
}
