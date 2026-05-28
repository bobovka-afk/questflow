import type { ReactNode } from 'react';
import { CheckinStreakCounter } from '@widgets/checkin-streak/counter/CheckinStreakCounter';
import { DAILY_CHECKIN_LABEL } from '@entities/reward';
import type { XpGrantRewards } from '@entities/reward';
import {
  CHECKIN_TOAST_ICON_SIZE,
  checkinToastIconUrl,
  XP_TOAST_ICON_SIZE,
  xpToastIconUrl,
} from '@shared/assets/uiAssets';

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

type CheckinProps = {
  rewards: XpGrantRewards;
  toastId: number;
};

export function CheckinRewardToast(props: CheckinProps) {
  const { rewards } = props;
  const showStreak =
    rewards.streakIncreased ||
    rewards.checkinStreak > 0 ||
    rewards.checkinXp > 0;

  return (
    <RewardToastShell
      toastId={props.toastId}
      className="trello-reward-toast trello-reward-toast--checkin"
    >
      {rewards.checkinXp > 0 || (rewards.streakMilestoneXp ?? 0) > 0 ? (
        <div className="trello-reward-toast-xp">
          <img
            src={xpToastIconUrl()}
            alt=""
            width={XP_TOAST_ICON_SIZE}
            height={XP_TOAST_ICON_SIZE}
            className="trello-reward-toast-xp-icon"
            loading="lazy"
            draggable={false}
          />
          <span className="trello-xp-toast-value">
            {rewards.checkinXp + (rewards.streakMilestoneXp ?? 0)}
          </span>
          <span className="trello-xp-toast-label">XP</span>
        </div>
      ) : null}
      <p className="trello-reward-toast-tagline">
        <img
          src={checkinToastIconUrl()}
          alt=""
          width={CHECKIN_TOAST_ICON_SIZE}
          height={CHECKIN_TOAST_ICON_SIZE}
          className="trello-reward-toast-tagline-icon"
          loading="lazy"
          draggable={false}
        />
        {DAILY_CHECKIN_LABEL}
      </p>
      {(rewards.streakMilestonesReached?.length ?? 0) > 0 ? (
        <p className="trello-reward-toast-extra">
          Порог серии:{' '}
          <strong>{rewards.streakMilestonesReached.join(', ')} дн.</strong>
        </p>
      ) : null}
      {showStreak ? (
        <div className="trello-reward-toast-streak">
          <CheckinStreakCounter
            streak={rewards.checkinStreak}
            animateFrom={
              rewards.streakIncreased ? rewards.previousCheckinStreak : null
            }
            size="toast"
          />
        </div>
      ) : null}
    </RewardToastShell>
  );
}

type TaskProps = {
  rewards: XpGrantRewards;
  toastId: number;
};

export function TaskRewardToast(props: TaskProps) {
  const { rewards } = props;

  return (
    <RewardToastShell
      toastId={props.toastId}
      className="trello-reward-toast trello-reward-toast--task"
    >
      {rewards.taskXp > 0 ? (
        <div className="trello-reward-toast-xp">
          <img
            src={xpToastIconUrl()}
            alt=""
            width={XP_TOAST_ICON_SIZE}
            height={XP_TOAST_ICON_SIZE}
            className="trello-reward-toast-xp-icon"
            loading="lazy"
            draggable={false}
          />
          <span className="trello-xp-toast-value">{rewards.taskXp}</span>
          <span className="trello-xp-toast-label">XP</span>
        </div>
      ) : null}
      <p className="trello-reward-toast-tagline">За закрытие карточки</p>
      {rewards.hpGained > 0 ? (
        <p className="trello-reward-toast-extra">
          Здоровье <strong>+{rewards.hpGained}</strong>
        </p>
      ) : null}
    </RewardToastShell>
  );
}
