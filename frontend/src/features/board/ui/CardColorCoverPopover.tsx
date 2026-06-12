import { useEffect, useRef } from 'react';
import {
  LIST_COLOR_PRESET_KEYS,
  LIST_PRESET_HEX,
  type ListColorPresetKey,
} from '@entities/board';
import type { CardCoverDisplayMode } from '../api/cardCoverApi';

type Props = {
  open: boolean;
  colorPreset: string | null;
  displayMode: CardCoverDisplayMode;
  busy?: boolean;
  onClose: () => void;
  onSelectColor: (preset: ListColorPresetKey, mode: CardCoverDisplayMode) => void;
  onRemoveCover: () => void;
};

function IconCoverBanner() {
  return (
    <svg width="44" height="32" viewBox="0 0 44 32" aria-hidden>
      <rect x="1" y="1" width="42" height="30" rx="3" fill="currentColor" opacity="0.15" />
      <rect x="1" y="1" width="42" height="10" rx="3" fill="currentColor" />
      <rect x="6" y="16" width="20" height="3" rx="1" fill="currentColor" opacity="0.35" />
      <rect x="6" y="22" width="30" height="3" rx="1" fill="currentColor" opacity="0.25" />
    </svg>
  );
}

function IconCoverFull() {
  return (
    <svg width="44" height="32" viewBox="0 0 44 32" aria-hidden>
      <rect x="1" y="1" width="42" height="30" rx="3" fill="currentColor" />
      <rect x="6" y="8" width="20" height="3" rx="1" fill="#fff" opacity="0.85" />
      <rect x="6" y="14" width="30" height="3" rx="1" fill="#fff" opacity="0.65" />
      <rect x="6" y="20" width="24" height="3" rx="1" fill="#fff" opacity="0.5" />
    </svg>
  );
}

export function CardColorCoverPopover({
  open,
  colorPreset,
  displayMode,
  busy,
  onClose,
  onSelectColor,
  onRemoveCover,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open, onClose]);

  if (!open) return null;

  const activePreset = colorPreset ?? null;
  const activeMode = displayMode === 'FULL' ? 'FULL' : 'BANNER';

  return (
    <div
      ref={rootRef}
      className="trello-card-cover-popover"
      role="dialog"
      aria-label="Обложка"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="trello-card-cover-popover-head">
        <span className="trello-card-cover-popover-title">Обложка</span>
        <button
          type="button"
          className="trello-card-cover-popover-close"
          aria-label="Закрыть"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      <p className="trello-card-cover-popover-label">Размер</p>
      <div className="trello-card-cover-size-row">
        <button
          type="button"
          className={
            activeMode === 'BANNER'
              ? 'trello-card-cover-size-btn trello-card-cover-size-btn--active'
              : 'trello-card-cover-size-btn'
          }
          disabled={busy}
          aria-label="Только шапка"
          title="Только шапка"
          onClick={() => {
            if (activePreset) onSelectColor(activePreset as ListColorPresetKey, 'BANNER');
          }}
        >
          <IconCoverBanner />
        </button>
        <button
          type="button"
          className={
            activeMode === 'FULL'
              ? 'trello-card-cover-size-btn trello-card-cover-size-btn--active'
              : 'trello-card-cover-size-btn'
          }
          disabled={busy}
          aria-label="Вся карточка"
          title="Вся карточка"
          onClick={() => {
            if (activePreset) onSelectColor(activePreset as ListColorPresetKey, 'FULL');
          }}
        >
          <IconCoverFull />
        </button>
      </div>

      <button
        type="button"
        className="trello-card-cover-remove-btn"
        disabled={busy || (!activePreset && displayMode === 'NONE')}
        onClick={onRemoveCover}
      >
        Убрать обложку
      </button>

      <p className="trello-card-cover-popover-label">Цвета</p>
      <div className="trello-color-grid trello-card-cover-color-grid">
        {LIST_COLOR_PRESET_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            className={
              activePreset === key
                ? 'trello-color-swatch trello-color-swatch-active'
                : 'trello-color-swatch'
            }
            style={{ backgroundColor: LIST_PRESET_HEX[key] }}
            disabled={busy}
            aria-label={key}
            onClick={() => onSelectColor(key, activeMode)}
          >
            {activePreset === key ? (
              <span className="trello-card-cover-swatch-check" aria-hidden>
                ✓
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
