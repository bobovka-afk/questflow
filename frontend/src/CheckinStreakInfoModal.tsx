import { createPortal } from 'react-dom';
import { CheckinStreakMilestonesPanel } from './CheckinStreakMilestonesPanel';
import { STREAK_LABEL } from './lib/gamificationCopy';
import { XP_DAILY_CHECKIN } from './lib/xpRewards';

type Props = {
  open: boolean;
  streak: number;
  onClose: () => void;
};

export function CheckinStreakInfoModal(props: Props) {
  if (!props.open) return null;

  return createPortal(
    <div
      className="trello-modal-backdrop"
      role="presentation"
      onClick={props.onClose}
    >
      <div
        className="trello-modal trello-streak-info-modal"
        role="dialog"
        aria-modal
        aria-labelledby="streak-info-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="trello-modal-head">
          <h2 id="streak-info-title" className="trello-modal-title">
            {STREAK_LABEL}
          </h2>
          <button
            type="button"
            className="trello-modal-close"
            onClick={props.onClose}
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>
        <div className="trello-modal-body trello-streak-info-modal-body">
          <p className="trello-streak-info-lead">
            За каждый игровой день с активностью серия растёт. При первом опыте за день
            автоматически +{XP_DAILY_CHECKIN} XP за {STREAK_LABEL.toLowerCase()}.
          </p>
          <CheckinStreakMilestonesPanel streak={props.streak} />
        </div>
        <div className="trello-modal-foot trello-modal-foot-center">
          <button type="button" className="trello-btn trello-btn-primary" onClick={props.onClose}>
            Понятно
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
