import { useMemo } from 'react';
import { STREAK_LABEL } from '@entities/reward';

type Props = {
  streak: number;
  /** When set, animates from this value to `streak` (Duolingo-style roll). */
  animateFrom?: number | null;
  size?: 'profile' | 'toast';
  className?: string;
};

export function CheckinStreakCounter(props: Props) {
  const size = props.size ?? 'profile';
  const rolling = useMemo(() => {
    const from = props.animateFrom;
    return from != null && from !== props.streak && props.streak > from;
  }, [props.animateFrom, props.streak]);

  const rootClass = [
    'trello-checkin-streak',
    size === 'toast' ? 'trello-checkin-streak--toast' : 'trello-checkin-streak--profile',
    rolling ? 'trello-checkin-streak--rolling' : '',
    props.className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={rootClass}
      role="img"
      aria-label={`${STREAK_LABEL}: ${props.streak} ${dayLabel(props.streak)}`}
      title={STREAK_LABEL}
    >
      <span className="trello-checkin-streak-flame" aria-hidden>
        🔥
      </span>
      <span className="trello-checkin-streak-value-wrap" aria-hidden>
        <span className="trello-checkin-streak-value">{props.streak}</span>
      </span>
      <span className="trello-checkin-streak-caption">{STREAK_LABEL}</span>
    </div>
  );
}

function dayLabel(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'день';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'дня';
  return 'дней';
}
