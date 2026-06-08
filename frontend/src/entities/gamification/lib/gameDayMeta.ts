import { api } from '@shared/api';
import { formatDateTimeRu, formatDateTimeRuInTimeZone } from '@shared/lib/formatDateRu';

export type GamificationMeta = {
  gameDayTz: string;
  nextGameDayResetAt: string;
};

let cache: GamificationMeta | null = null;

export async function fetchGamificationMeta(): Promise<GamificationMeta> {
  if (cache) return cache;
  const data = await api<GamificationMeta>('/gamification/meta', { method: 'GET' });
  cache = data;
  return data;
}

export function formatGameDayResetRu(iso: string, timeZone: string): string {
  try {
    return formatDateTimeRuInTimeZone(iso, timeZone);
  } catch {
    return formatDateTimeRu(iso);
  }
}

export function clearGamificationMetaCache(): void {
  cache = null;
}
