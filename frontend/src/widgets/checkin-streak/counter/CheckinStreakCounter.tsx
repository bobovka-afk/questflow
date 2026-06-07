import { useMemo, type ReactNode } from 'react';
import { STREAK_LABEL } from '@entities/reward';
import { checkinToastIconUrl } from '@shared/assets/uiAssets';

type Props = {
  streak: number;
  /** When set, animates from this value to `streak` (Duolingo-style roll). */
  animateFrom?: number | null;
  size?: 'profile' | 'toast';
  className?: string;
  onClick?: () => void;
};

const STREAK_FLAME_SIZE: Record<'profile' | 'toast', number> = {
  profile: 26,
  toast: 22,
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
    props.onClick ? 'trello-checkin-streak--clickable' : '',
    props.className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const ariaLabel = `${STREAK_LABEL}: ${props.streak} ${dayLabel(props.streak)}`;
  const flameSize = STREAK_FLAME_SIZE[size];

  const content: ReactNode = (
    <>
      <img
        src={checkinToastIconUrl()}
        alt=""
        width={flameSize}
        height={flameSize}
        className="trello-checkin-streak-flame"
        draggable={false}
      />
      <span className="trello-checkin-streak-value-wrap" aria-hidden={props.onClick ? true : undefined}>
        <span className="trello-checkin-streak-value">{props.streak}</span>
      </span>
      <span className="trello-checkin-streak-caption">{STREAK_LABEL}</span>
    </>
  );

  if (props.onClick) {
    return (
      <button
        type="button"
        className={rootClass}
        aria-label={`Информация о ${STREAK_LABEL.toLowerCase()}: ${props.streak} ${dayLabel(props.streak)}`}
        title="Подробнее о серии"
        onClick={props.onClick}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={rootClass} role="img" aria-label={ariaLabel} title={STREAK_LABEL}>
      {content}
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
