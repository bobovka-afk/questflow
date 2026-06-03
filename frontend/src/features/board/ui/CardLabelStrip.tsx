import { LIST_PRESET_HEX } from '@entities/board';
import type { WorkspaceLabelRow } from '../lib/boardCardFilters';

type Props = {
  labels: WorkspaceLabelRow[] | undefined;
  max?: number;
};

export function CardLabelStrip({ labels, max = 4 }: Props) {
  const items = (labels ?? []).slice(0, max);
  if (items.length === 0) return null;

  return (
    <div className="trello-card-label-strip" aria-hidden>
      {items.map((l) => (
        <span
          key={l.id}
          className="trello-card-label-pill"
          style={{ backgroundColor: LIST_PRESET_HEX[l.colorPreset] ?? LIST_PRESET_HEX.GRAY }}
          title={l.name}
        >
          {l.name}
        </span>
      ))}
      {(labels?.length ?? 0) > max ? (
        <span className="trello-card-label-pill trello-card-label-pill--more">
          +{(labels?.length ?? 0) - max}
        </span>
      ) : null}
    </div>
  );
}
