import { useEffect, useState } from 'react';
import { chestTapFrameUrls, chestTapsRequired } from '@entities/chest/lib/chestAssets';
import type { ChestTier } from '@entities/quest';

type Props = {
  tier: ChestTier;
  frameIndex: number;
  waitingForApi?: boolean;
  onTap: () => void;
};

export function ChestTapOpenView(props: Props) {
  const frames = chestTapFrameUrls(props.tier);
  const tapsRequired = chestTapsRequired(props.tier);
  const [bumping, setBumping] = useState(false);
  const src = frames?.[props.frameIndex] ?? null;
  const tapsDone = props.frameIndex >= tapsRequired;
  const showHint = !tapsDone && !props.waitingForApi;

  useEffect(() => {
    frames?.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [frames]);

  function handleTap() {
    if (props.waitingForApi || tapsDone) return;
    setBumping(true);
    window.setTimeout(() => setBumping(false), 80);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
    props.onTap();
  }

  return (
    <div className="trello-chest-tap-open">
      <button
        type="button"
        className={[
          'trello-chest-tap-open-chest',
          bumping ? 'trello-chest-tap-open-chest--bump' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={handleTap}
        disabled={props.waitingForApi || tapsDone}
        aria-label="Нажмите на сундук, чтобы открыть"
      >
        {src ? (
          <img src={src} alt="" className="trello-chest-tap-open-img" draggable={false} />
        ) : null}
      </button>
      {showHint && (
        <p className="trello-chest-tap-open-hint">
          Нажмите на сундук{' '}
          <span className="trello-chest-tap-open-counter">
            {props.frameIndex}/{tapsRequired}
          </span>
        </p>
      )}
      {props.waitingForApi && (
        <p className="trello-chest-tap-open-hint trello-muted">Загружаем награду…</p>
      )}
    </div>
  );
}
