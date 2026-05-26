import { DEFAULT_GAME_DAY_TZ } from '../constants';

export function getGameDayKey(
  instant: Date,
  timeZone: string = DEFAULT_GAME_DAY_TZ,
): Date {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(instant);

  const year = parts.find((p) => p.type === 'year')?.value;
  const month = parts.find((p) => p.type === 'month')?.value;
  const day = parts.find((p) => p.type === 'day')?.value;

  if (!year || !month || !day) {
    throw new Error(`Failed to resolve game day in timezone ${timeZone}`);
  }

  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
}

export function getTodayGameDayKey(
  timeZone: string = DEFAULT_GAME_DAY_TZ,
): Date {
  return getGameDayKey(new Date(), timeZone);
}

export function getYesterdayGameDayKey(
  timeZone: string = DEFAULT_GAME_DAY_TZ,
): Date {
  const today = getTodayGameDayKey(timeZone);
  const yesterday = new Date(today);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  return yesterday;
}

export function getGameDayBounds(
  dayKey: Date,
  timeZone: string = DEFAULT_GAME_DAY_TZ,
): { start: Date; end: Date } {
  const start = findGameDayStartInstant(dayKey, timeZone);
  const nextKey = new Date(dayKey);
  nextKey.setUTCDate(nextKey.getUTCDate() + 1);
  const end = findGameDayStartInstant(nextKey, timeZone);
  return { start, end };
}

function findGameDayStartInstant(dayKey: Date, timeZone: string): Date {
  const target = dayKey.getTime();
  const y = dayKey.getUTCFullYear();
  const mo = dayKey.getUTCMonth();
  const d = dayKey.getUTCDate();

  let firstMatch: Date | null = null;
  for (let hour = -28; hour <= 28; hour++) {
    const candidate = new Date(Date.UTC(y, mo, d, hour, 0, 0, 0));
    if (getGameDayKey(candidate, timeZone).getTime() === target) {
      firstMatch = candidate;
      break;
    }
  }

  if (!firstMatch) {
    throw new Error(
      `Could not find start of game day ${dayKey.toISOString()} in ${timeZone}`,
    );
  }

  let start = firstMatch.getTime();
  let lo = start - 24 * 60 * 60 * 1000;
  let hi = start;
  while (hi - lo > 60_000) {
    const mid = Math.floor((lo + hi) / 2);
    if (getGameDayKey(new Date(mid), timeZone).getTime() === target) {
      hi = mid;
    } else {
      lo = mid;
    }
  }

  return new Date(hi);
}
