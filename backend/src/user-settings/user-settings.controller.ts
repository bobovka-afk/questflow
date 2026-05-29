import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import type { AuthedRequest } from '../common/type';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { REFRESH_TOKEN_COOKIE_NAME } from '../auth/constants/refresh-token.constants';
import { UpdateGamificationSettingsDto } from './dto/update-gamification-settings.dto';
import type {
  UserSecurityEventView,
  UserSessionView,
  UserSettingsView,
} from './interface';
import { clientIpFromForwarded } from './lib/settings-json';
import { UserSettingsService } from './user-settings.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

function sessionMetaFromRequest(req: Request) {
  const userAgent = req.headers['user-agent'];
  const ipAddress =
    clientIpFromForwarded(req.headers['x-forwarded-for']) ??
    req.ip ??
    req.socket.remoteAddress ??
    undefined;
  return {
    userAgent: typeof userAgent === 'string' ? userAgent : undefined,
    ipAddress,
  };
}

function refreshTokenFromRequest(req: Request): string | undefined {
  return req.cookies?.[REFRESH_TOKEN_COOKIE_NAME] as string | undefined;
}

@ApiTags('user-settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user/me')
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @Get('settings')
  @ApiOperation({ summary: 'Get current user settings' })
  @ApiResponse({ status: 200, description: 'User settings returned successfully.' })
  getSettings(@Req() req: AuthedRequest): Promise<UserSettingsView> {
    return this.userSettingsService.getSettings(req.user.id);
  }

  @Patch('settings/gamification')
  @ApiOperation({ summary: 'Update gamification settings' })
  @ApiResponse({ status: 200, description: 'Gamification settings updated successfully.' })
  updateGamificationSettings(
    @Req() req: AuthedRequest & { ip?: string },
    @Body() body: UpdateGamificationSettingsDto,
  ): Promise<UserSettingsView> {
    return this.userSettingsService.updateGamificationSettings(
      req.user.id,
      body,
      sessionMetaFromRequest(req),
    );
  }

  @Get('sessions')
  @ApiOperation({ summary: 'List user sessions / devices' })
  @ApiResponse({ status: 200, description: 'User sessions returned successfully.' })
  listSessions(@Req() req: Request & AuthedRequest): Promise<UserSessionView[]> {
    return this.userSettingsService.listSessions(
      req.user.id,
      refreshTokenFromRequest(req),
    );
  }

  @Delete('sessions/:sessionId')
  @ApiOperation({ summary: 'Revoke a specific session' })
  @ApiResponse({ status: 200, description: 'Session revoked successfully.' })
  @ApiResponse({ status: 404, description: "code: 'SESSION_NOT_FOUND'" })
  async revokeSession(
    @Req() req: Request & AuthedRequest,
    @Param('sessionId') sessionId: string,
  ): Promise<{ ok: true }> {
    await this.userSettingsService.revokeSessionById(
      req.user.id,
      sessionId,
      sessionMetaFromRequest(req),
    );
    return { ok: true };
  }

  @Delete('sessions')
  @ApiOperation({ summary: 'Revoke all sessions except current' })
  @ApiResponse({ status: 200, description: 'Other sessions revoked successfully.' })
  async revokeOtherSessions(
    @Req() req: Request & AuthedRequest,
  ): Promise<{ ok: true }> {
    await this.userSettingsService.revokeAllOtherSessions(
      req.user.id,
      refreshTokenFromRequest(req),
      sessionMetaFromRequest(req),
    );
    return { ok: true };
  }

  @Get('security-events')
  @ApiOperation({ summary: 'List security audit events' })
  @ApiResponse({ status: 200, description: 'Security events returned successfully.' })
  listSecurityEvents(@Req() req: AuthedRequest): Promise<UserSecurityEventView[]> {
    return this.userSettingsService.listSecurityEvents(req.user.id);
  }
}
