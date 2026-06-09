import { createPortal } from 'react-dom';

type Props = {
  previewUrl: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function CardPasteAttachmentPrompt({
  previewUrl,
  busy = false,
  onConfirm,
  onCancel,
}: Props) {
  return createPortal(
    <div
      className="trello-modal-backdrop trello-alert-modal-backdrop trello-card-paste-modal-backdrop"
      role="presentation"
      onClick={() => !busy && onCancel()}
    >
      <div
        className="trello-modal trello-card-paste-modal"
        role="dialog"
        aria-modal
        aria-labelledby="card-paste-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="trello-modal-head">
          <h2 className="trello-modal-title" id="card-paste-modal-title">
            Отправить изображение?
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

        <div className="trello-card-paste-modal-preview">
          <img src={previewUrl} alt="" />
        </div>

        <div className="trello-modal-foot">
          <button
            type="button"
            className="trello-btn trello-btn-ghost"
            disabled={busy}
            onClick={onCancel}
          >
            Отмена
          </button>
          <button
            type="button"
            className="trello-btn trello-btn-primary"
            disabled={busy}
            onClick={onConfirm}
          >
            {busy ? '…' : 'Отправить'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
