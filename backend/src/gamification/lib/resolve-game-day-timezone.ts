import { CronJob } from 'cron';
import { DEFAULT_GAME_DAY_TZ } from '../constants';

type WarnLogger = { warn: (message: string) => void };

/** IANA timezone for game-day boundaries; invalid/empty env → UTC. */
export function resolveGameDayTimeZone(
  raw: string | undefined,
  logger?: WarnLogger,
): string {
  const candidate = raw?.trim();
  if (!candidate) return DEFAULT_GAME_DAY_TZ;

  try {
    new CronJob('* * * * *', () => {}, null, false, candidate);
    return candidate;
  } catch {
    logger?.warn(
      `Invalid GAME_DAY_TZ "${candidate}", falling back to ${DEFAULT_GAME_DAY_TZ}`,
    );
    return DEFAULT_GAME_DAY_TZ;
  }
}
