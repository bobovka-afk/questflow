import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';

type Props = {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  busy?: boolean;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Удалить',
  cancelLabel = 'Отмена',
  busy = false,
  danger = true,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return createPortal(
    <div
      className="trello-modal-backdrop trello-alert-modal-backdrop"
      role="presentation"
      onClick={() => !busy && onCancel()}
    >
      <div
        className="trello-modal trello-modal-narrow"
        role="alertdialog"
        aria-modal
        aria-labelledby="confirm-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="trello-modal-head">
          <h2 className="trello-modal-title" id="confirm-modal-title">
            {title}
          </h2>
          <button
            type="button"
            className="trello-modal-close"
            onClick={() => !busy && onCancel()}
            disabled={busy}
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>
        <div className="trello-modal-body">
          <p className="trello-confirm-text">{message}</p>
        </div>
        <div className="trello-modal-foot">
          <button
            type="button"
            className="trello-btn trello-btn-ghost"
            disabled={busy}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={danger ? 'trello-btn trello-btn-danger' : 'trello-btn trello-btn-primary'}
            disabled={busy}
            onClick={onConfirm}
          >
            {busy ? '…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
