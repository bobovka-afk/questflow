import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DEFAULT_GAME_DAY_TZ } from './constants';
import { getNextGameDayResetAt } from './lib/next-game-day-reset';

export type GamificationMetaView = {
  gameDayTz: string;
  nextGameDayResetAt: string;
};

@ApiTags('gamification')
@Controller('gamification')
export class GamificationMetaController {
  constructor(private readonly configService: ConfigService) {}

  @Get('meta')
  @ApiOperation({ summary: 'Public gamification clock (game day timezone)' })
  @ApiResponse({ status: 200 })
  getMeta(): GamificationMetaView {
    const gameDayTz =
      this.configService.get<string>('GAME_DAY_TZ') ?? DEFAULT_GAME_DAY_TZ;
    return {
      gameDayTz,
      nextGameDayResetAt: getNextGameDayResetAt(gameDayTz).toISOString(),
    };
  }
}
