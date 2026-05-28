import { useState } from 'react';
import { CHEST_TIER_LABEL_RU, type ChestTier } from '@entities/quest';
import { ChestLootOddsModal } from './ChestLootOddsModal';

type Props = {
  tier: ChestTier;
};

export function ChestLootOddsButton(props: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="trello-chest-loot-odds-btn"
        aria-label={`Шансы выпадения из ${CHEST_TIER_LABEL_RU[props.tier].toLowerCase()} сундука`}
        title="Шансы выпадения"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <span className="trello-chest-loot-odds-btn-icon" aria-hidden>
          %
        </span>
      </button>
      {open && <ChestLootOddsModal tier={props.tier} onClose={() => setOpen(false)} />}
    </>
  );
}
