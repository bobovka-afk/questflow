import { getGameDayKey } from '../core/game-day';

export function getDailyPeriodKey(
  instant: Date,
  timeZone: string,
): string {
  const day = getGameDayKey(instant, timeZone);
  const y = day.getUTCFullYear();
  const m = String(day.getUTCMonth() + 1).padStart(2, '0');
  const d = String(day.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Calendar month in game timezone: `YYYY-MM`. */
export function getMonthlyPeriodKey(
  instant: Date,
  timeZone: string,
): string {
  const day = getGameDayKey(instant, timeZone);
  const y = day.getUTCFullYear();
  const m = String(day.getUTCMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export function getWeeklyPeriodKey(
  instant: Date,
  timeZone: string,
): string {
  const day = getGameDayKey(instant, timeZone);
  const date = new Date(
    Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate()),
  );
  const dayNr = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - dayNr + 3);
  const firstThursday = date.getTime();
  date.setUTCMonth(0, 1);
  if (date.getUTCDay() !== 4) {
    date.setUTCMonth(0, 1 + ((4 - date.getUTCDay() + 7) % 7));
  }
  const week =
    1 + Math.ceil((firstThursday - date.getTime()) / (7 * 24 * 60 * 60 * 1000));
  const year = new Date(firstThursday).getUTCFullYear();
  return `${year}-W${String(week).padStart(2, '0')}`;
}

export function parseWeeklyPeriodKey(periodKey: string): {
  year: number;
  week: number;
} {
  const match = /^(\d{4})-W(\d{2})$/.exec(periodKey);
  if (!match) {
    throw new Error(`Invalid weekly period key: ${periodKey}`);
  }
  return { year: Number(match[1]), week: Number(match[2]) };
}

export function getWeekDayKeyRange(
  periodKey: string,
  timeZone: string,
): { start: Date; end: Date } {
  const { year, week } = parseWeeklyPeriodKey(periodKey);
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const dayNr = (jan4.getUTCDay() + 6) % 7;
  const week1Monday = new Date(jan4);
  week1Monday.setUTCDate(jan4.getUTCDate() - dayNr);
  const monday = new Date(week1Monday);
  monday.setUTCDate(week1Monday.getUTCDate() + (week - 1) * 7);
  const start = getGameDayKey(monday, timeZone);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);
  return { start, end };
}
