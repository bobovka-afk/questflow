import { getGameDayBounds, getGameDayKey } from '../core/game-day';

/** ISO instant when the current game day ends (next midnight in GAME_DAY_TZ). */
export function getNextGameDayResetAt(
  timeZone: string,
  now: Date = new Date(),
): Date {
  const dayKey = getGameDayKey(now, timeZone);
  return getGameDayBounds(dayKey, timeZone).end;
}
