import { useEffect, useState } from 'react';
import { CheckinStreakCounter } from './CheckinStreakCounter';
import { CheckinStreakInfoModal } from './CheckinStreakInfoModal';
import { StreakProfileNotice } from './StreakProfileNotice';
import type { StreakProfileFeedback } from './lib/characterStreakSnapshot';
import { STREAK_LABEL } from './lib/gamificationCopy';

type Props = {
  streak: number;
  animateFrom: number | null;
  celebrate: boolean;
  lostNotice: Extract<StreakProfileFeedback, { kind: 'lost' }> | null;
  onDismissLost: () => void;
};

export function CheckinStreakProfileRow(props: Props) {
  const [infoOpen, setInfoOpen] = useState(false);

  useEffect(() => {
    if (props.lostNotice) {
      setInfoOpen(true);
    }
  }, [props.lostNotice]);

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
          onClick={() => setInfoOpen(true)}
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
        onClose={() => setInfoOpen(false)}
      />
    </>
  );
}
