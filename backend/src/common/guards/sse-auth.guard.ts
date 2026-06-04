import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { UserSettingsService } from '../../user-settings/user-settings.service';

/** JWT for SSE: Authorization header or ?accessToken= query (EventSource cannot set headers). */
@Injectable()
export class SseAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly userSettingsService: UserSettingsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const header = req.headers.authorization;
    const fromQuery =
      typeof req.query?.accessToken === 'string' ? req.query.accessToken : undefined;
    const raw =
      (typeof header === 'string' && header.startsWith('Bearer ')
        ? header.slice(7)
        : null) ?? fromQuery;
    if (!raw) {
      throw new UnauthorizedException({ code: 'UNAUTHORIZED', message: 'Missing token' });
    }
    try {
      const payload = this.jwtService.verify(raw) as { id: string; sid?: string };
      const user = await this.userService.getById(payload.id);
      if (!user) {
        throw new UnauthorizedException({ code: 'UNAUTHORIZED', message: 'Invalid token' });
      }
      if (payload.sid) {
        const active = await this.userSettingsService.isSessionActive(user.id, payload.sid);
        if (!active) {
          throw new UnauthorizedException({
            code: 'SESSION_REVOKED',
            message: 'Session revoked',
          });
        }
      }
      req.user = { ...user, sessionId: payload.sid };
      return true;
    } catch {
      throw new UnauthorizedException({ code: 'UNAUTHORIZED', message: 'Invalid token' });
    }
  }
}
