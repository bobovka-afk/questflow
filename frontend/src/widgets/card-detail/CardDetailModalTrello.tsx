import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { uploadCardAttachment, type CardAttachmentRow } from '@features/board/api/cardAttachmentsApi';
import { formatApiError } from '@shared/api';
import { CardAttachmentsSection } from '@features/board/ui/CardAttachmentsSection';
import { CardLabelStrip } from '@features/board/ui/CardLabelStrip';
import { RichCommentBody } from '@features/board/ui/RichCommentBody';
import { attachmentMarkdown } from '@features/board/lib/richTextEditor';
import { CARD_REMINDER_OPTIONS } from '@features/board/lib/boardCardFilters';
export type CardDetailCard = {
  id: number;
  title: string;
  isCompleted?: boolean;
  coverImageUrl?: string | null;
  attachmentCount?: number;
  labels?: WorkspaceLabelRow[];
  createdAt: string;
};

export type CardDetailComment = {
  id: number;
  userId: number;
  body: string;
  createdAt: string;
  user: { id: number; name: string; avatarPath?: string | null };
};
import type { WorkspaceLabelRow } from '@features/board/lib/boardCardFilters';
import { avatarInitials, avatarSrcFromPath, userProfilePath } from '@entities/user';
import { handleSpaTileAuxClick, handleSpaTileClick } from '@shared/lib/navigation-core';

type WorkspaceMember = {
  userId: number;
  user: { id: number; name: string; avatarPath?: string | null };
};

type Panel = 'labels' | 'dates' | 'members' | null;

function IconLines() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3 17h18v2H3v-2zm0-6h18v2H3v-2zm0-6h18v2H3V5z" />
    </svg>
  );
}

function IconLabel() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
    </svg>
  );
}

function IconMember() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

function IconAttach() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
    </svg>
  );
}

function EditorFooter({
  onSave,
  onCancel,
  saveDisabled,
  saveLabel,
  saving,
  showFormattingHelp,
}: {
  onSave: () => void;
  onCancel: () => void;
  saveDisabled?: boolean;
  saveLabel?: string;
  saving?: boolean;
  showFormattingHelp?: boolean;
}) {
  return (
    <div className="trello-card-detail-editor-footer">
      <div className="trello-card-detail-editor-footer-actions">
        <button
          type="button"
          className="trello-btn trello-btn-primary trello-btn-sm"
          disabled={saveDisabled || saving}
          onClick={onSave}
        >
          {saving ? '…' : (saveLabel ?? 'Сохранить')}
        </button>
        <button
          type="button"
          className="trello-btn trello-btn-ghost trello-btn-sm"
          disabled={saving}
          onClick={onCancel}
        >
          Отмена
        </button>
      </div>
      {showFormattingHelp ? (
        <span className="trello-card-detail-editor-help" title="Markdown: **жирный**, *курсив*, списки">
          Помощь по форматированию
        </span>
      ) : null}
    </div>
  );
}

function CommentAvatarBubble({
  name,
  avatarPath,
  profileTo,
}: {
  name: string;
  avatarPath?: string | null;
  profileTo: string;
}) {
  const [broken, setBroken] = useState(false);
  const src = avatarSrcFromPath(avatarPath);
  return (
    <button
      type="button"
      className="trello-card-comment-avatar trello-card-comment-avatar-btn"
      onClick={(e) => handleSpaTileClick(e, profileTo)}
      onAuxClick={(e) => handleSpaTileAuxClick(e, profileTo)}
      title={name}
    >
      {src && !broken ? (
        <img
          className="trello-card-comment-avatar-img"
          src={src}
          alt=""
          onError={() => setBroken(true)}
        />
      ) : (
        <span className="trello-card-comment-avatar-fallback" aria-hidden>
          {avatarInitials(name)}
        </span>
      )}
    </button>
  );
}

export type CardDetailModalTrelloProps = {
  card: CardDetailCard;
  listName: string;
  workspaceId: number;
  accessToken: string | null;
  currentUserId: number | null;
  currentUserName: string;
  busy: boolean;
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
  onCoverChange: () => void;
  onToggleComplete: (e: React.MouseEvent<HTMLButtonElement>) => void;
  completionBusy?: boolean;
  title: string;
  onTitleChange: (v: string) => void;
  titleEditing: boolean;
  onTitleEditStart: () => void;
  onTitleSave: () => void;
  onTitleCancel: () => void;
  titleInputRef: React.RefObject<HTMLTextAreaElement | null>;
  description: string;
  onDescriptionChange: (v: string) => void;
  onDescriptionSave: () => void;
  onDescriptionCancel: () => void;
  due: string;
  onDueChange: (v: string) => void;
  reminder: string;
  onReminderChange: (v: string) => void;
  assigneeId: number | null;
  onAssigneeChange: (id: number | null) => void;
  labelIds: number[];
  onLabelIdsChange: (ids: number[]) => void;
  wsLabels: WorkspaceLabelRow[];
  members: WorkspaceMember[];
  canManageWorkspace: boolean;
  comments: CardDetailComment[];
  commentsLoading: boolean;
  commentDraft: string;
  onCommentDraftChange: (v: string) => void;
  commentSubmitBusy: boolean;
  onSubmitComment: () => void;
  formatCommentRelativeAgo: (iso: string, nowMs: number) => string;
  nowTick: number;
  editingCommentId: number | null;
  editCommentDraft: string;
  onEditCommentDraftChange: (v: string) => void;
  commentEditBusy: boolean;
  onStartEditComment: (c: CardDetailComment) => void;
  onCancelEditComment: () => void;
  onSaveCommentEdit: (id: number) => void;
  onDeleteComment: (c: CardDetailComment) => void;
};

export function CardDetailModalTrello(props: CardDetailModalTrelloProps) {
  const [panel, setPanel] = useState<Panel>(null);
  const [cardAttachments, setCardAttachments] = useState<CardAttachmentRow[]>([]);
  const [attachRev, setAttachRev] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [commentExpanded, setCommentExpanded] = useState(false);
  const [commentSnapshot, setCommentSnapshot] = useState('');
  const [attachUploadBusy, setAttachUploadBusy] = useState(false);
  const [attachError, setAttachError] = useState<string | null>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const cardFileInputRef = useRef<HTMLInputElement>(null);
  const commentFileInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetRef = useRef<'card' | 'comment'>('card');
  const openAttachmentPickerRef = useRef<(() => void) | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPanel(null);
    setCardAttachments([]);
    setMenuOpen(false);
    setDescExpanded(false);
    setCommentExpanded(false);
    setCommentSnapshot('');
    setAttachError(null);
  }, [props.card.id]);

  function openCardFilePicker() {
    uploadTargetRef.current = 'card';
    if (openAttachmentPickerRef.current) {
      openAttachmentPickerRef.current();
      return;
    }
    cardFileInputRef.current?.click();
  }

  function openCommentFilePicker() {
    uploadTargetRef.current = 'comment';
    commentFileInputRef.current?.click();
  }

  async function handleFileUpload(file: File | undefined, target: 'card' | 'comment') {
    if (!file || !props.accessToken) return;
    setAttachUploadBusy(true);
    setAttachError(null);
    try {
      const row = await uploadCardAttachment(
        props.accessToken,
        props.workspaceId,
        props.card.id,
        file,
      );
      notifyAttachmentsChanged();
      if (target === 'comment') {
        const next = `${props.commentDraft}${attachmentMarkdown(row)}`.trimStart();
        props.onCommentDraftChange(next);
        setCommentSnapshot(next);
        setCommentExpanded(true);
      }
    } catch (e) {
      setAttachError(formatApiError(e));
    } finally {
      setAttachUploadBusy(false);
      if (cardFileInputRef.current) cardFileInputRef.current.value = '';
      if (commentFileInputRef.current) commentFileInputRef.current.value = '';
    }
  }

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [menuOpen]);

  const togglePanel = (p: Panel) => setPanel((cur) => (cur === p ? null : p));

  const assigneeMember = useMemo(
    () => props.members.find((m) => m.user.id === props.assigneeId),
    [props.members, props.assigneeId],
  );

  function notifyAttachmentsChanged() {
    setAttachRev((v) => v + 1);
    props.onCoverChange();
  }

  type ActivityItem =
    | { kind: 'created'; at: string; key: string }
    | { kind: 'attachment'; at: string; key: string; row: CardAttachmentRow }
    | { kind: 'comment'; at: string; key: string; comment: CardDetailComment };

  const activityItems = useMemo((): ActivityItem[] => {
    const items: ActivityItem[] = [
      { kind: 'created', at: props.card.createdAt, key: 'created' },
      ...cardAttachments.map((row) => ({
        kind: 'attachment' as const,
        at: row.createdAt,
        key: `att-${row.id}`,
        row,
      })),
      ...props.comments.map((comment) => ({
        kind: 'comment' as const,
        at: comment.createdAt,
        key: `c-${comment.id}`,
        comment,
      })),
    ];
    return items.sort(
      (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
    );
  }, [props.card.createdAt, cardAttachments, props.comments]);

  let panelContent: ReactNode = null;
  if (panel === 'labels' && props.wsLabels.length > 0) {
    panelContent = (
      <div className="trello-card-detail-popover">
        <div className="trello-card-label-picks">
          {props.wsLabels.map((l) => {
            const on = props.labelIds.includes(l.id);
            return (
              <button
                key={l.id}
                type="button"
                className={`trello-label-chip${on ? ' trello-label-chip--on' : ''}`}
                onClick={() =>
                  props.onLabelIdsChange(
                    on ? props.labelIds.filter((id) => id !== l.id) : [...props.labelIds, l.id],
                  )
                }
              >
                {l.name}
              </button>
            );
          })}
        </div>
      </div>
    );
  } else if (panel === 'dates') {
    panelContent = (
      <div className="trello-card-detail-popover trello-card-detail-popover--dates">
        <label className="trello-field">
          <span className="trello-label">Срок</span>
          <input
            className="trello-input"
            type="datetime-local"
            value={props.due}
            onChange={(e) => props.onDueChange(e.target.value)}
          />
        </label>
        <label className="trello-field">
          <span className="trello-label">Напоминание</span>
          <select
            className="trello-input"
            value={props.reminder}
            onChange={(e) => props.onReminderChange(e.target.value)}
            disabled={props.busy || !props.due}
          >
            {CARD_REMINDER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  } else if (panel === 'members') {
    panelContent = (
      <div className="trello-card-detail-popover trello-card-detail-popover--members">
        <label className="trello-field">
          <span className="trello-label">Исполнитель</span>
          <select
            className="trello-input trello-card-assignee-select"
            value={props.assigneeId == null ? '' : String(props.assigneeId)}
            onChange={(e) => {
              const v = e.target.value;
              props.onAssigneeChange(v === '' ? null : Number(v));
            }}
            disabled={props.busy}
          >
            <option value="">Не назначен</option>
            {props.members.map((m) => (
              <option key={m.user.id} value={m.user.id}>
                {m.user.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  }

  return (
    <div
      className="trello-modal-backdrop trello-modal-backdrop--card-trello"
      role="presentation"
      onClick={() => !props.busy && props.onClose()}
    >
      <div
        className="trello-modal trello-modal-card-detail trello-modal-card-detail--trello"
        role="dialog"
        aria-modal
        aria-label={props.card.title}
        onClick={(e) => e.stopPropagation()}
      >
        {props.card.coverImageUrl ? (
          <div className="trello-card-detail-cover-wrap">
            <img
              className="trello-card-detail-cover-img"
              src={props.card.coverImageUrl}
              alt=""
            />
          </div>
        ) : null}

        <div className="trello-card-detail-layout">
          <div className="trello-card-detail-layout-main">
            <div className="trello-card-detail-title-row">
              <button
                type="button"
                className={
                  props.card.isCompleted
                    ? 'trello-card-complete-btn trello-card-complete-btn--done trello-card-detail-complete-btn'
                    : 'trello-card-complete-btn trello-card-detail-complete-btn'
                }
                aria-label={
                  props.card.isCompleted
                    ? 'Отметить как невыполненную'
                    : 'Отметить как выполненную'
                }
                aria-pressed={Boolean(props.card.isCompleted)}
                disabled={props.busy || props.completionBusy}
                onClick={props.onToggleComplete}
              >
                {props.card.isCompleted ? (
                  <span className="trello-card-complete-check" aria-hidden>
                    ✓
                  </span>
                ) : null}
              </button>
              <div className="trello-card-detail-title-block">
                {props.titleEditing ? (
                  <div className="trello-card-detail-title-edit">
                    <textarea
                      ref={props.titleInputRef}
                      className="trello-card-detail-title-input"
                      value={props.title}
                      onChange={(e) => props.onTitleChange(e.target.value)}
                      maxLength={50}
                      disabled={props.busy}
                      rows={2}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          props.onTitleSave();
                        }
                        if (e.key === 'Escape') {
                          e.preventDefault();
                          props.onTitleCancel();
                        }
                      }}
                    />
                    <div className="trello-card-detail-title-edit-actions">
                      <button
                        type="button"
                        className="trello-card-detail-text-btn"
                        onClick={() => props.onTitleSave()}
                      >
                        Сохранить
                      </button>
                      <button
                        type="button"
                        className="trello-card-detail-text-btn"
                        onClick={() => props.onTitleCancel()}
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className={
                      props.card.isCompleted
                        ? 'trello-card-detail-title-hit trello-card-detail-title-hit--done'
                        : 'trello-card-detail-title-hit'
                    }
                    disabled={props.busy}
                    onClick={() => props.onTitleEditStart()}
                  >
                    <span className="trello-card-detail-title">
                      {props.title.trim() || props.card.title}
                    </span>
                  </button>
                )}
              </div>
              <div className="trello-card-detail-header-actions">
                <div className="trello-card-detail-menu-wrap" ref={menuRef}>
                  <button
                    type="button"
                    className="trello-card-detail-icon-btn"
                    aria-label="Действия"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((v) => !v)}
                  >
                    <span className="trello-card-detail-ellipsis" aria-hidden>
                      •••
                    </span>
                  </button>
                  {menuOpen ? (
                    <div className="trello-card-detail-menu" role="menu">
                      <button
                        type="button"
                        role="menuitem"
                        disabled={props.title.trim().length < 3 || props.busy}
                        onClick={() => {
                          setMenuOpen(false);
                          props.onSave();
                        }}
                      >
                        Сохранить
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        className="trello-card-detail-menu-danger"
                        disabled={props.busy}
                        onClick={() => {
                          setMenuOpen(false);
                          props.onDelete();
                        }}
                      >
                        Удалить карточку
                      </button>
                    </div>
                  ) : null}
                </div>
                <button
                  type="button"
                  className="trello-card-detail-icon-btn trello-card-detail-close-btn"
                  aria-label="Закрыть"
                  onClick={() => !props.busy && props.onClose()}
                >
                  ×
                </button>
              </div>
            </div>

            {props.accessToken ? (
              <input
                ref={cardFileInputRef}
                type="file"
                className="trello-card-attachments-file-input"
                accept="image/*,.pdf,.txt,.csv,.zip,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                disabled={attachUploadBusy}
                onChange={(e) =>
                  void handleFileUpload(e.target.files?.[0], uploadTargetRef.current)
                }
              />
            ) : null}
            {props.accessToken ? (
              <input
                ref={commentFileInputRef}
                type="file"
                className="trello-card-attachments-file-input"
                accept="image/*,.pdf,.txt,.csv,.zip,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                disabled={attachUploadBusy}
                onChange={(e) => void handleFileUpload(e.target.files?.[0], 'comment')}
              />
            ) : null}
            {attachError ? (
              <p className="trello-card-detail-attach-error" role="alert">
                {attachError}
              </p>
            ) : null}
            <div className="trello-card-detail-add-row">
              {props.wsLabels.length > 0 ? (
                <button
                  type="button"
                  className={`trello-card-detail-add-btn${panel === 'labels' ? ' trello-card-detail-add-btn--active' : ''}`}
                  onClick={() => togglePanel('labels')}
                >
                  <IconLabel /> Метки
                </button>
              ) : null}
              <button
                type="button"
                className={`trello-card-detail-add-btn${panel === 'dates' ? ' trello-card-detail-add-btn--active' : ''}`}
                onClick={() => togglePanel('dates')}
              >
                <IconClock /> Даты
              </button>
              <button
                type="button"
                className={`trello-card-detail-add-btn${panel === 'members' ? ' trello-card-detail-add-btn--active' : ''}`}
                onClick={() => togglePanel('members')}
              >
                <IconMember /> Участники
              </button>
              {props.accessToken ? (
                <button
                  type="button"
                  className="trello-card-detail-add-btn"
                  disabled={attachUploadBusy}
                  aria-label="Прикрепить файл"
                  onClick={() => openCardFilePicker()}
                >
                  <IconAttach />
                </button>
              ) : null}
            </div>

            {panelContent}

            {(props.card.labels?.length ?? 0) > 0 ? (
              <div className="trello-card-detail-meta-row">
                <CardLabelStrip labels={props.card.labels} />
              </div>
            ) : null}
            {assigneeMember ? (
              <p className="trello-card-detail-assignee-hint">
                Исполнитель: {assigneeMember.user.name}
              </p>
            ) : null}

            <section className="trello-card-detail-section">
              <div className="trello-card-detail-section-head">
                <span className="trello-card-detail-section-icon">
                  <IconLines />
                </span>
                <h3 className="trello-card-detail-section-title">Описание</h3>
              </div>
              <div
                className={
                  descExpanded
                    ? 'trello-card-detail-editor trello-card-detail-editor--expanded'
                    : 'trello-card-detail-editor'
                }
              >
                <textarea
                  ref={descRef}
                  className="trello-card-detail-desc"
                  value={props.description}
                  onChange={(e) => props.onDescriptionChange(e.target.value)}
                  onFocus={() => setDescExpanded(true)}
                  rows={descExpanded ? 6 : 3}
                  maxLength={2000}
                  placeholder="Добавьте более подробное описание…"
                />
                {descExpanded ? (
                  <EditorFooter
                    saving={props.busy}
                    saveDisabled={props.busy}
                    onSave={() => {
                      props.onDescriptionSave();
                      setDescExpanded(false);
                    }}
                    onCancel={() => {
                      props.onDescriptionCancel();
                      setDescExpanded(false);
                    }}
                  />
                ) : null}
              </div>
            </section>

            {props.accessToken ? (
              <CardAttachmentsSection
                key={`att-${props.card.id}-${attachRev}`}
                accessToken={props.accessToken}
                workspaceId={props.workspaceId}
                cardId={props.card.id}
                variant="modal"
                nowMs={props.nowTick}
                formatRelativeAgo={props.formatCommentRelativeAgo}
                onCoverChange={notifyAttachmentsChanged}
                onAttachmentsLoaded={setCardAttachments}
                onRegisterFilePicker={(open) => {
                  openAttachmentPickerRef.current = open;
                }}
              />
            ) : null}
          </div>

          <aside className="trello-card-detail-layout-activity" aria-label="Комментарии и события">
            <h3 className="trello-card-detail-activity-title trello-card-detail-activity-title--solo">
              <span className="trello-card-detail-activity-icon" aria-hidden>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
                </svg>
              </span>
              Комментарии и события
            </h3>

            {props.accessToken ? (
              <div
                className={
                  commentExpanded
                    ? 'trello-card-detail-comment-compose trello-card-detail-comment-compose--expanded'
                    : 'trello-card-detail-comment-compose'
                }
              >
                {commentExpanded ? (
                  <CommentAvatarBubble
                    name={props.currentUserName}
                    avatarPath={
                      props.members.find((m) => m.user.id === props.currentUserId)?.user
                        .avatarPath
                    }
                    profileTo={
                      props.currentUserId != null ? '/profile/me' : '/workspaces'
                    }
                  />
                ) : null}
                <div
                  className={
                    commentExpanded
                      ? 'trello-card-detail-editor trello-card-detail-editor--expanded'
                      : 'trello-card-detail-editor trello-card-detail-editor--comment'
                  }
                >
                  <div className="trello-card-detail-comment-input-wrap">
                    <textarea
                      ref={commentRef}
                      className="trello-card-detail-comment-input"
                      value={props.commentDraft}
                      onChange={(e) => props.onCommentDraftChange(e.target.value)}
                      onFocus={() => {
                        setCommentSnapshot(props.commentDraft);
                        setCommentExpanded(true);
                      }}
                      placeholder="Напишите комментарий…"
                      rows={commentExpanded ? 4 : 1}
                      maxLength={2000}
                      disabled={props.commentSubmitBusy || attachUploadBusy}
                      onKeyDown={(e) => {
                        if (
                          commentExpanded &&
                          e.key === 'Enter' &&
                          !e.shiftKey &&
                          props.commentDraft.trim().length > 0
                        ) {
                          e.preventDefault();
                          props.onSubmitComment();
                          setCommentExpanded(false);
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="trello-card-detail-comment-attach-btn"
                      aria-label="Прикрепить файл к комментарию"
                      disabled={attachUploadBusy || props.commentSubmitBusy}
                      onClick={() => openCommentFilePicker()}
                    >
                      <IconAttach />
                    </button>
                  </div>
                  {commentExpanded ? (
                    <EditorFooter
                      saveLabel="Сохранить"
                      saving={props.commentSubmitBusy}
                      saveDisabled={
                        props.commentSubmitBusy || props.commentDraft.trim().length === 0
                      }
                      onSave={() => {
                        props.onSubmitComment();
                        setCommentExpanded(false);
                      }}
                      onCancel={() => {
                        props.onCommentDraftChange(commentSnapshot);
                        setCommentExpanded(false);
                        commentRef.current?.blur();
                      }}
                    />
                  ) : null}
                </div>
              </div>
            ) : (
              <p className="trello-card-comments-guest-hint">Войдите, чтобы комментировать.</p>
            )}

            <ul className="trello-card-detail-activity-list">
              {props.commentsLoading && activityItems.length === 0 ? (
                <li className="trello-card-detail-activity-empty">Загрузка…</li>
              ) : (
                activityItems.map((item) => {
                  if (item.kind === 'created') {
                    return (
                      <li key={item.key} className="trello-card-detail-activity-item">
                        <CommentAvatarBubble
                          name={props.currentUserName}
                          avatarPath={
                            props.members.find((m) => m.user.id === props.currentUserId)?.user
                              .avatarPath
                          }
                          profileTo={
                            props.currentUserId != null ? '/profile/me' : '/workspaces'
                          }
                        />
                        <div className="trello-card-detail-activity-body">
                          <p>
                            <strong>{props.currentUserName}</strong> добавил(а) эту карточку в
                            список <strong>{props.listName}</strong>
                          </p>
                          <time
                            className="trello-card-detail-activity-time"
                            dateTime={item.at}
                          >
                            {props.formatCommentRelativeAgo(item.at, props.nowTick)}
                          </time>
                        </div>
                      </li>
                    );
                  }

                  if (item.kind === 'attachment') {
                    const a = item.row;
                    const profileTo = userProfilePath(a.uploader.id);
                    return (
                      <li key={item.key} className="trello-card-detail-activity-item">
                        <CommentAvatarBubble
                          name={a.uploader.name}
                          avatarPath={
                            props.members.find((m) => m.user.id === a.uploader.id)?.user
                              .avatarPath
                          }
                          profileTo={profileTo}
                        />
                        <div className="trello-card-detail-activity-body">
                          <p>
                            <button
                              type="button"
                              className="trello-card-comment-author-link"
                              onClick={(e) => handleSpaTileClick(e, profileTo)}
                            >
                              <strong>{a.uploader.name}</strong>
                            </button>{' '}
                            прикрепил(а) вложение{' '}
                            <strong>{a.fileName}</strong> к этой карточке
                          </p>
                          <time className="trello-card-detail-activity-time" dateTime={item.at}>
                            {props.formatCommentRelativeAgo(item.at, props.nowTick)}
                          </time>
                          {a.isImage && (a.previewUrl ?? a.url) ? (
                            <a
                              className="trello-activity-attachment-preview"
                              href={a.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img src={a.previewUrl ?? a.url} alt="" />
                            </a>
                          ) : null}
                        </div>
                      </li>
                    );
                  }

                  const c = item.comment;
                  const isAuthor =
                    props.currentUserId != null && c.userId === props.currentUserId;
                  const canDelete = isAuthor || props.canManageWorkspace;
                  const authorProfileTo = isAuthor ? '/profile/me' : userProfilePath(c.userId);
                  return (
                    <li key={item.key} className="trello-card-detail-activity-item">
                      <CommentAvatarBubble
                        name={c.user.name}
                        avatarPath={c.user.avatarPath}
                        profileTo={authorProfileTo}
                      />
                      <div className="trello-card-detail-activity-body">
                        {props.editingCommentId === c.id ? (
                          <>
                            <div className="trello-card-detail-editor trello-card-detail-editor--expanded">
                              <textarea
                                className="trello-card-detail-comment-input"
                                value={props.editCommentDraft}
                                onChange={(e) =>
                                  props.onEditCommentDraftChange(e.target.value)
                                }
                                rows={3}
                                disabled={props.commentEditBusy}
                              />
                            </div>
                            <div className="trello-card-comment-edit-actions">
                              <button
                                type="button"
                                className="trello-card-detail-text-btn"
                                disabled={props.commentEditBusy}
                                onClick={() => props.onSaveCommentEdit(c.id)}
                              >
                                Сохранить
                              </button>
                              <button
                                type="button"
                                className="trello-card-detail-text-btn"
                                onClick={props.onCancelEditComment}
                              >
                                Отмена
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="trello-card-detail-activity-comment">
                              <button
                                type="button"
                                className="trello-card-comment-author-link"
                                onClick={(e) => handleSpaTileClick(e, authorProfileTo)}
                              >
                                <strong>{c.user.name}</strong>
                              </button>
                              <RichCommentBody body={c.body} members={props.members} />
                            </div>
                            <time
                              className="trello-card-detail-activity-time"
                              dateTime={c.createdAt}
                            >
                              {props.formatCommentRelativeAgo(c.createdAt, props.nowTick)}
                            </time>
                            {(isAuthor || canDelete) && (
                              <div className="trello-card-comment-actions">
                                {isAuthor ? (
                                  <button
                                    type="button"
                                    className="trello-card-comment-link"
                                    onClick={() => props.onStartEditComment(c)}
                                  >
                                    Редактировать
                                  </button>
                                ) : null}
                                {canDelete ? (
                                  <button
                                    type="button"
                                    className="trello-card-comment-link trello-card-comment-link-danger"
                                    onClick={() => props.onDeleteComment(c)}
                                  >
                                    Удалить
                                  </button>
                                ) : null}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
