import { api } from '@shared/api';

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
    return new Intl.DateTimeFormat('ru-RU', {
      timeZone,
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return new Date(iso).toLocaleString('ru-RU');
  }
}

export function clearGamificationMetaCache(): void {
  cache = null;
}
