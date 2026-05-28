import { dayLabelRu } from '@entities/character/lib/checkinStreakProgress';
import type { StreakProfileFeedback } from '@entities/character/lib/characterStreakSnapshot';
import { STREAK_LABEL } from '@entities/reward';

type Props = {
  feedback: Extract<StreakProfileFeedback, { kind: 'lost' }>;
  onDismiss: () => void;
};

export function StreakProfileNotice(props: Props) {
  const { feedback } = props;

  return (
    <div
      className="trello-streak-profile-notice trello-streak-profile-notice--lost"
      role="status"
    >
      <p className="trello-streak-profile-notice-title">{STREAK_LABEL} прервалась</p>
      <p className="trello-streak-profile-notice-text">
        Было{' '}
        <strong>
          {feedback.previous} {dayLabelRu(feedback.previous)}
        </strong>{' '}
        подряд. Сейчас{' '}
        <strong>
          {feedback.current} {dayLabelRu(feedback.current)}
        </strong>
        {feedback.current <= 1
          ? ' — закройте карточку сегодня, чтобы начать новую серию.'
          : '.'}
      </p>
      <button
        type="button"
        className="trello-streak-profile-notice-dismiss"
        onClick={props.onDismiss}
      >
        Понятно
      </button>
    </div>
  );
}
