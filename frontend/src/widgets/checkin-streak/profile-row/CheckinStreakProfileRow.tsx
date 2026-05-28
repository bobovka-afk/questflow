import { useState } from 'react';
import { CheckinStreakCounter } from '@widgets/checkin-streak/counter/CheckinStreakCounter';
import { CheckinStreakInfoModal } from '@widgets/checkin-streak/info-modal/CheckinStreakInfoModal';
import { StreakProfileNotice } from '@widgets/checkin-streak/profile-notice/StreakProfileNotice';
import type { StreakProfileFeedback } from '@entities/character/lib/characterStreakSnapshot';
import { STREAK_LABEL } from '@entities/reward';

type Props = {
  streak: number;
  animateFrom: number | null;
  celebrate: boolean;
  lostNotice: Extract<StreakProfileFeedback, { kind: 'lost' }> | null;
  onDismissLost: () => void;
};

export function CheckinStreakProfileRow(props: Props) {
  const [manualInfoOpen, setManualInfoOpen] = useState(false);
  const infoOpen = manualInfoOpen || Boolean(props.lostNotice);

  return (
    <>
      {props.lostNotice ? (
        <StreakProfileNotice feedback={props.lostNotice} onDismiss={props.onDismissLost} />
      ) : null}

      <div className="trello-character-streak-row">
        <div
          className={[
            'trello-character-streak-block',
            props.celebrate ? 'trello-character-streak-block--celebrate' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <CheckinStreakCounter
            streak={props.streak}
            animateFrom={props.animateFrom}
            size="profile"
          />
        </div>
        <button
          type="button"
          className="trello-streak-info-btn"
          onClick={() => setManualInfoOpen(true)}
          aria-label={`Информация о ${STREAK_LABEL.toLowerCase()}`}
          title="Информация о серии"
        >
          <span className="trello-streak-info-btn-icon" aria-hidden>
            i
          </span>
        </button>
      </div>

      <CheckinStreakInfoModal
        open={infoOpen}
        streak={props.streak}
        onClose={() => setManualInfoOpen(false)}
      />
    </>
  );
}
