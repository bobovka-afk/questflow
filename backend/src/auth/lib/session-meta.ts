import type { Request } from 'express';
import type { SessionRequestMeta } from '../../user-settings/interface';
import { clientIpFromForwarded } from '../../user-settings/lib/settings-json';

export function sessionMetaFromRequest(req: Pick<Request, 'headers' | 'ip' | 'socket'>): SessionRequestMeta {
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
