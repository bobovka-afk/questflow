import { useEffect, useState } from 'react';
import {
  fetchGamificationMeta,
  formatGameDayResetRu,
  type GamificationMeta,
} from '@entities/gamification/lib/gameDayMeta';

type Props = {
  className?: string;
};

export function GameDayHint({ className }: Props) {
  const [meta, setMeta] = useState<GamificationMeta | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchGamificationMeta()
      .then((m) => {
        if (!cancelled) setMeta(m);
      })
      .catch(() => {
        if (!cancelled) setMeta(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!meta) return null;

  const resetLabel = formatGameDayResetRu(meta.nextGameDayResetAt, meta.gameDayTz);

  return (
    <p className={className ?? 'trello-game-day-hint'}>
      Игровые сутки ({meta.gameDayTz}): сброс лимита XP и дневных квестов в{' '}
      <time dateTime={meta.nextGameDayResetAt}>{resetLabel}</time>.
    </p>
  );
}
