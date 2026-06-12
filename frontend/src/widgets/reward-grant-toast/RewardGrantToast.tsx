import type { ReactNode } from 'react';
import { DAILY_CHECKIN_LABEL } from '@entities/reward';
import type { XpGrantRewards } from '@entities/reward';

type ToastShellProps = {
  toastId: number;
  className: string;
  children: ReactNode;
};

function RewardToastShell(props: ToastShellProps) {
  return (
    <div className="trello-xp-toast-root" aria-live="polite">
      <div key={props.toastId} className={props.className}>
        {props.children}
      </div>
    </div>
  );
}

function formatStreakDayLabel(streak: number): string {
  if (streak <= 0) return 'Активный день';
  if (streak === 1) return '1-й день подряд';
  return `${streak}-й день подряд`;
}

function joinRewardSubParts(parts: ReactNode[]): ReactNode {
  return parts.reduce<ReactNode[]>((acc, part, index) => {
    if (index === 0) return [part];
    return [...acc, ' · ', part];
  }, []);
}

type CheckinProps = {
  rewards: XpGrantRewards;
  toastId: number;
  showXp?: boolean;
  disableStreakAnimation?: boolean;
};

/** C-3 Flame hero — серия за игровой день. */
export function CheckinRewardToast(props: CheckinProps) {
  const { rewards } = props;
  const showXp = props.showXp ?? true;
  const xpTotal = rewards.checkinXp + (rewards.streakMilestoneXp ?? 0);
  const showXpLine = showXp && xpTotal > 0;
  const milestones = rewards.streakMilestonesReached ?? [];

  return (
    <RewardToastShell
      toastId={props.toastId}
      className="trello-reward-toast trello-reward-toast--checkin-hero"
    >
      <div
        className="trello-reward-toast-hero-icon trello-reward-toast-hero-icon--flame"
        aria-hidden
      >
        🔥
      </div>
      <p className="trello-reward-toast-hero-label">
        {formatStreakDayLabel(rewards.checkinStreak)}
      </p>
      {showXpLine ? (
        <p className="trello-reward-toast-hero-sub">
          Серия засчитана · <strong>+{xpTotal} XP</strong>
        </p>
      ) : rewards.checkinStreak > 0 ? (
        <p className="trello-reward-toast-hero-sub">{DAILY_CHECKIN_LABEL} засчитана</p>
      ) : null}
      {milestones.length > 0 ? (
        <p className="trello-reward-toast-hero-sub trello-reward-toast-hero-sub--milestone">
          Порог серии: <strong>{milestones.join(', ')} дн.</strong>
        </p>
      ) : null}
    </RewardToastShell>
  );
}

type TaskProps = {
  rewards: XpGrantRewards;
  toastId: number;
  /** Подпись причины; по умолчанию — закрытие карточки. */
  reason?: string;
};

/** XP-6 Star hero — начисление опыта за действие. */
export function TaskRewardToast(props: TaskProps) {
  const { rewards } = props;
  const reason = props.reason ?? 'За закрытие карточки';
  const subParts: ReactNode[] = [];

  if (rewards.taskXp > 0) {
    subParts.push(<strong key="xp">+{rewards.taskXp} XP</strong>);
  }
  if (rewards.hpGained > 0) {
    subParts.push(
      <span key="hp" className="trello-reward-toast-hero-hp">
        +{rewards.hpGained} HP
      </span>,
    );
  }
  if (rewards.manaGained != null && rewards.manaGained > 0) {
    subParts.push(
      <span key="mana" className="trello-reward-toast-hero-mana">
        +{rewards.manaGained} маны
      </span>,
    );
  }

  return (
    <RewardToastShell
      toastId={props.toastId}
      className="trello-reward-toast trello-reward-toast--task-hero"
    >
      <div
        className="trello-reward-toast-hero-icon trello-reward-toast-hero-icon--star"
        aria-hidden
      >
        ⭐
      </div>
      <p className="trello-reward-toast-hero-label">{reason}</p>
      {subParts.length > 0 ? (
        <p className="trello-reward-toast-hero-sub">{joinRewardSubParts(subParts)}</p>
      ) : null}
    </RewardToastShell>
  );
}
