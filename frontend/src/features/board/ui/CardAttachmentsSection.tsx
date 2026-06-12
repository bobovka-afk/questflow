import { useCallback, useEffect, useRef, useState } from 'react';
import { formatApiError } from '@shared/api';
import { ConfirmModal } from '@shared/ui/confirm-modal/ConfirmModal';
import {
  addCardAttachmentLink,
  deleteCardAttachment,
  fetchCardAttachments,
  formatAttachmentSize,
  setCardCover,
  uploadCardAttachment,
  type CardAttachmentRow,
} from '../api/cardAttachmentsApi';
import { validateAttachmentFile } from '../lib/attachmentFile';

type Props = {
  accessToken: string;
  workspaceId: number;
  cardId: number;
  onCoverChange?: () => void;
  onRegisterFilePicker?: (open: () => void) => void;
  onAttachmentsLoaded?: (rows: CardAttachmentRow[]) => void;
  uiHidden?: boolean;
  variant?: 'default' | 'modal';
  formatRelativeAgo?: (iso: string, nowMs: number) => string;
  nowMs?: number;
};

export function CardAttachmentsSection({
  accessToken,
  workspaceId,
  cardId,
  onCoverChange,
  onRegisterFilePicker,
  onAttachmentsLoaded,
  uiHidden = false,
  variant = 'default',
  formatRelativeAgo,
  nowMs = Date.now(),
}: Props) {
  const [rows, setRows] = useState<CardAttachmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<CardAttachmentRow | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const isModal = variant === 'modal';

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchCardAttachments(accessToken, workspaceId, cardId);
      setRows(list);
      onAttachmentsLoaded?.(list);
    } catch {
      setRows([]);
      onAttachmentsLoaded?.([]);
    } finally {
      setLoading(false);
    }
  }, [accessToken, workspaceId, cardId, onAttachmentsLoaded]);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    onRegisterFilePicker?.(() => fileRef.current?.click());
  }, [onRegisterFilePicker]);

  async function handleFilePick(file: File | undefined) {
    if (!file) return;
    const validationError = validateAttachmentFile(file);
    if (validationError) {
      setMsg(validationError);
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const created = await uploadCardAttachment(accessToken, workspaceId, cardId, file);
      if (created.isImage) {
        const current = await fetchCardAttachments(accessToken, workspaceId, cardId);
        if (!current.some((r) => r.isCover)) {
          await setCardCover(accessToken, workspaceId, cardId, created.id);
        }
      }
      await reload();
      onCoverChange?.();
    } catch (e) {
      setMsg(formatApiError(e));
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function handleAddLink() {
    const url = linkUrl.trim();
    if (!url) return;
    setBusy(true);
    setMsg(null);
    try {
      await addCardAttachmentLink(accessToken, workspaceId, cardId, url);
      setLinkUrl('');
      setLinkOpen(false);
      await reload();
      onCoverChange?.();
    } catch (e) {
      setMsg(formatApiError(e));
    } finally {
      setBusy(false);
    }
  }

  async function confirmDeleteAttachment() {
    if (!deleteTarget) return;
    setBusy(true);
    setMsg(null);
    try {
      await deleteCardAttachment(accessToken, workspaceId, cardId, deleteTarget.id);
      setDeleteTarget(null);
      await reload();
      onCoverChange?.();
    } catch (e) {
      setMsg(formatApiError(e));
    } finally {
      setBusy(false);
    }
  }

  const fileRows = rows.filter((r) => r.kind === 'FILE' || r.isImage);
  const linkRows = rows.filter((r) => r.kind === 'LINK');
  const allFiles = [...fileRows, ...linkRows];

  if (uiHidden || (isModal && (loading || allFiles.length === 0))) {
    return (
      <div className="trello-card-attachments trello-card-attachments--picker-only" aria-hidden>
        <input
          ref={fileRef}
          type="file"
          className="trello-card-attachments-file-input"
          accept="image/*,.pdf,.txt,.csv,.zip,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
          disabled={busy}
          onChange={(e) => void handleFilePick(e.target.files?.[0])}
        />
      </div>
    );
  }

  return (
    <section
      className={
        isModal
          ? 'trello-card-attachments trello-card-attachments--modal'
          : 'trello-card-attachments'
      }
    >
      <input
        ref={fileRef}
        type="file"
        className="trello-card-attachments-file-input"
        accept="image/*,.pdf,.txt,.csv,.zip,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
        disabled={busy}
        onChange={(e) => void handleFilePick(e.target.files?.[0])}
      />

      <div className="trello-card-attachments-head">
        <span className="trello-card-attachments-icon" aria-hidden>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
          </svg>
        </span>
        <h3 className="trello-card-attachments-title">Вложения</h3>
        {isModal ? (
          <button
            type="button"
            className="trello-card-attachments-add-head-btn"
            disabled={busy}
            onClick={() => fileRef.current?.click()}
          >
            Добавить
          </button>
        ) : null}
      </div>

      {loading ? (
        <p className="trello-card-attachments-hint">Загрузка…</p>
      ) : allFiles.length === 0 ? (
        !isModal ? <p className="trello-card-attachments-hint">Нет вложений.</p> : null
      ) : (
        <>
          {isModal ? <p className="trello-card-attachments-files-label">Файлы</p> : null}
          <ul className={isModal ? 'trello-card-attachments-files' : 'trello-card-attachments-list'}>
            {allFiles.map((a) => {
              const when = formatRelativeAgo
                ? formatRelativeAgo(a.createdAt, nowMs)
                : '';
              const sizeLabel =
                a.kind === 'FILE' && a.sizeBytes != null
                  ? formatAttachmentSize(a.sizeBytes)
                  : a.isVideoLink
                    ? 'Ссылка на видео'
                    : a.kind === 'LINK'
                      ? 'Ссылка'
                      : '';
              const metaParts = [
                when ? `Добавлено ${when}` : '',
                sizeLabel,
              ].filter(Boolean);
              return (
                <li
                  key={a.id}
                  className={
                    isModal
                      ? 'trello-card-attachments-file-row'
                      : 'trello-card-attachments-list-item'
                  }
                >
                  {a.isImage && a.previewUrl ? (
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="trello-card-attachments-file-thumb"
                    >
                      <img src={a.previewUrl} alt="" />
                    </a>
                  ) : (
                    <span
                      className={`trello-card-attachments-file-icon${a.isVideoLink ? ' trello-card-attachments-file-icon--video' : ''}`}
                      aria-hidden
                    />
                  )}
                  <div className="trello-card-attachments-file-main">
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="trello-card-attachments-link"
                    >
                      {a.fileName}
                    </a>
                    {metaParts.length > 0 ? (
                      <p className="trello-card-attachments-meta">{metaParts.join(' · ')}</p>
                    ) : null}
                  </div>
                  <div className="trello-card-attachments-file-actions">
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="trello-card-attachments-file-open"
                      title="Открыть"
                      aria-label="Открыть"
                    >
                      ↗
                    </a>
                    <button
                      type="button"
                      className="trello-card-attachments-file-menu-btn"
                      title="Удалить"
                      disabled={busy}
                      onClick={() => setDeleteTarget(a)}
                    >
                      ×
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {msg ? <p className="trello-card-attachments-error">{msg}</p> : null}

      {!isModal ? (
        <>
          <div className="trello-card-attachments-add">
            <button
              type="button"
              className="trello-card-sidebar-btn"
              disabled={busy}
              onClick={() => fileRef.current?.click()}
            >
              Прикрепить файл
            </button>
            <button
              type="button"
              className="trello-card-sidebar-btn"
              disabled={busy}
              onClick={() => setLinkOpen((v) => !v)}
            >
              Прикрепить ссылку
            </button>
          </div>
          {linkOpen ? (
            <div className="trello-card-attachments-link-form">
              <input
                className="trello-input"
                type="url"
                placeholder="https://… (YouTube, Drive, сайт)"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                disabled={busy}
              />
              <button
                type="button"
                className="trello-btn trello-btn-primary trello-btn-sm"
                disabled={busy || !linkUrl.trim()}
                onClick={() => void handleAddLink()}
              >
                {busy ? '…' : 'Добавить'}
              </button>
            </div>
          ) : null}
          <p className="trello-card-attachments-hint">
            До 10 МБ на файл. Видео — только по ссылке.
          </p>
        </>
      ) : null}

      <ConfirmModal
        open={deleteTarget != null}
        title="Удалить вложение?"
        message={
          deleteTarget ? (
            <>
              Файл <strong>{deleteTarget.fileName}</strong> будет удалён без возможности
              восстановления.
            </>
          ) : (
            'Вложение будет удалено без возможности восстановления.'
          )
        }
        confirmLabel="Удалить"
        busy={busy}
        onConfirm={() => void confirmDeleteAttachment()}
        onCancel={() => !busy && setDeleteTarget(null)}
      />
    </section>
  );
}
