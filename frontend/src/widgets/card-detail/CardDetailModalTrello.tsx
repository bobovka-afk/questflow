import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { uploadCardAttachment, type CardAttachmentRow } from '@features/board/api/cardAttachmentsApi';
import { validateAttachmentFile, getImageFileFromClipboardEvent } from '@features/board/lib/attachmentFile';
import { formatApiError } from '@shared/api';
import { CardAttachmentsSection } from '@features/board/ui/CardAttachmentsSection';
import { CardPasteAttachmentPrompt } from '@features/board/ui/CardPasteAttachmentPrompt';
import { CardLabelStrip } from '@features/board/ui/CardLabelStrip';
import { RichCommentBody } from '@features/board/ui/RichCommentBody';
import { attachmentMarkdown } from '@features/board/lib/richTextEditor';
import { CardDatesPopover } from '@features/board/ui/CardDatesPopover';
import { attachmentIdsEmbeddedInComments } from '@features/board/lib/commentAttachmentActivity';
import {
  setCardColorCover,
  type CardCoverDisplayMode,
  type CardCoverPatch,
} from '@features/board/api/cardCoverApi';
import { CardColorCoverPopover } from '@features/board/ui/CardColorCoverPopover';
import { CardMembersPopover } from '@features/board/ui/CardMembersPopover';
import { CardMembersStrip } from '@features/board/ui/CardMembersStrip';
import { CardDetailIconTooltip } from '@features/board/ui/CardDetailIconTooltip';
import { CARD_TITLE_MAX_LENGTH } from '@entities/card/lib/cardLimits';
import { listHeaderColor } from '@entities/board';
import type { ListColorPresetKey } from '@entities/board';
import { characterPortraitUrl } from '@entities/character';
import type { WorkspaceLabelRow } from '@features/board/lib/boardCardFilters';
import {
  activityUserDisplayName,
  avatarInitials,
  avatarSrcFromPath,
  userProfilePath,
  type ActivityUserBrief,
} from '@entities/user';
import { handleSpaTileAuxClick, handleSpaTileClick } from '@shared/lib/navigation-core';
import { IconAttach } from '@shared/ui/icons/IconAttach';

export type CardDetailCard = {
  id: number;
  title: string;
  isCompleted?: boolean;
  coverImageUrl?: string | null;
  coverColorPreset?: string | null;
  coverDisplayMode?: CardCoverDisplayMode;
  attachmentCount?: number;
  labels?: WorkspaceLabelRow[];
  createdAt: string;
};

export type CardDetailComment = {
  id: number;
  userId: number;
  body: string;
  createdAt: string;
  user: ActivityUserBrief;
};

type WorkspaceMember = {
  userId: number;
  user: ActivityUserBrief;
};

type Panel = 'labels' | 'dates' | 'members' | null;

type PastePreview = {
  file: File;
  previewUrl: string;
  target: 'card' | 'comment';
};

type PendingCommentAttachment = {
  id: string;
  file: File;
  previewUrl: string;
  isImage: boolean;
};

function nextPendingId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function isCommentAuthor(
  comment: CardDetailComment,
  currentUserId: number | null,
): boolean {
  if (currentUserId == null) return false;
  return comment.userId === currentUserId || comment.user.id === currentUserId;
}

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

function IconCover() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
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
  onAttach,
  attachDisabled,
  attachLabel = 'Прикрепить файл',
}: {
  onSave: () => void;
  onCancel: () => void;
  saveDisabled?: boolean;
  saveLabel?: string;
  saving?: boolean;
  showFormattingHelp?: boolean;
  onAttach?: () => void;
  attachDisabled?: boolean;
  attachLabel?: string;
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
        {onAttach ? (
          <button
            type="button"
            className="trello-card-detail-editor-attach-btn"
            aria-label={attachLabel}
            disabled={attachDisabled || saving}
            onClick={onAttach}
          >
            <IconAttach />
          </button>
        ) : null}
      </div>
      {showFormattingHelp ? (
        <span className="trello-card-detail-editor-help" title="Markdown: **жирный**, *курсив*, списки">
          Помощь по форматированию
        </span>
      ) : null}
    </div>
  );
}

function resolveActivityUser(
  members: WorkspaceMember[],
  userId: number,
  direct?: Partial<ActivityUserBrief>,
): ActivityUserBrief {
  const memberUser = members.find((m) => m.user.id === userId)?.user;
  return {
    id: userId,
    name: direct?.name ?? memberUser?.name ?? 'Участник',
    avatarPath: direct?.avatarPath ?? memberUser?.avatarPath ?? null,
    characterName: direct?.characterName ?? memberUser?.characterName ?? null,
    characterAvatarPreset:
      direct?.characterAvatarPreset ?? memberUser?.characterAvatarPreset ?? null,
  };
}

function CommentAvatarBubble({
  user,
  profileTo,
}: {
  user: ActivityUserBrief;
  profileTo: string;
}) {
  const [broken, setBroken] = useState(false);
  const label = activityUserDisplayName(user);
  const characterSrc = user.characterAvatarPreset
    ? characterPortraitUrl(user.characterAvatarPreset)
    : null;
  const accountSrc = avatarSrcFromPath(user.avatarPath);
  const src = characterSrc ?? accountSrc;
  const isCharacter = Boolean(characterSrc);
  return (
    <button
      type="button"
      className="trello-card-comment-avatar trello-card-comment-avatar-btn"
      onClick={(e) => handleSpaTileClick(e, profileTo)}
      onAuxClick={(e) => handleSpaTileAuxClick(e, profileTo)}
      title={label}
    >
      {src && !broken ? (
        <img
          className={[
            'trello-card-comment-avatar-img',
            isCharacter ? 'trello-card-comment-avatar-img--character' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          src={src}
          alt=""
          onError={() => setBroken(true)}
        />
      ) : (
        <span className="trello-card-comment-avatar-fallback" aria-hidden>
          {avatarInitials(label)}
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
  onDelete: () => void;
  onArchive: () => void;
  /** Pass patch for instant local update; omit to refetch card from board (attachments). */
  onCoverChange: (patch?: CardCoverPatch) => void;
  canArchive?: boolean;
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
  reminder: string;
  onDatesSave: (due: string, reminder: string) => void | Promise<void>;
  onDatesRemove: () => void | Promise<void>;
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
  onSubmitComment: (body: string) => void | Promise<void>;
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
  const [coverPopoverOpen, setCoverPopoverOpen] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [commentExpanded, setCommentExpanded] = useState(false);
  const [commentSnapshot, setCommentSnapshot] = useState('');
  const [attachUploadBusy, setAttachUploadBusy] = useState(false);
  const [attachError, setAttachError] = useState<string | null>(null);
  const [pastePreview, setPastePreview] = useState<PastePreview | null>(null);
  const [pendingCommentAttachments, setPendingCommentAttachments] = useState<
    PendingCommentAttachment[]
  >([]);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const cardFileInputRef = useRef<HTMLInputElement>(null);
  const commentFileInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetRef = useRef<'card' | 'comment'>('card');
  const openAttachmentPickerRef = useRef<(() => void) | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const coverDisplayMode = props.card.coverDisplayMode ?? 'NONE';
  const coverColor = props.card.coverColorPreset
    ? listHeaderColor(props.card.coverColorPreset)
    : null;
  const hasColorCover =
    Boolean(coverColor) && coverDisplayMode !== 'NONE';
  /* В модалке BANNER и FULL — только полоса шапки; полная заливка только в колонке */
  const isBannerCover =
    Boolean(props.card.coverImageUrl) || hasColorCover;
  const topbarOnCover = isBannerCover;

  async function applyColorCover(
    preset: ListColorPresetKey | null,
    mode: CardCoverDisplayMode,
  ) {
    if (!props.accessToken) return;

    const nextMode: CardCoverDisplayMode = preset == null ? 'NONE' : mode;
    const currentPreset = props.card.coverColorPreset ?? null;
    if (currentPreset === preset && coverDisplayMode === nextMode) {
      return;
    }

    const patch: CardCoverPatch = {
      coverColorPreset: preset,
      coverDisplayMode: nextMode,
      ...(preset != null ? { coverImageUrl: null } : {}),
    };
    props.onCoverChange(patch);

    try {
      await setCardColorCover(
        props.accessToken,
        props.workspaceId,
        props.card.id,
        preset,
        nextMode,
      );
    } catch (e) {
      props.onCoverChange();
      setAttachError(formatApiError(e));
    }
  }

  useEffect(() => {
    setPanel(null);
    setCardAttachments([]);
    setMenuOpen(false);
    setDescExpanded(false);
    setCommentExpanded(false);
    setCommentSnapshot('');
    setAttachError(null);
    setPastePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev.previewUrl);
      return null;
    });
    clearPendingCommentAttachments();
  }, [props.card.id]);

  function clearPendingCommentAttachments() {
    setPendingCommentAttachments((prev) => {
      for (const item of prev) URL.revokeObjectURL(item.previewUrl);
      return [];
    });
  }

  function queueCommentAttachment(file: File, previewUrl?: string) {
    const url = previewUrl ?? URL.createObjectURL(file);
    setPendingCommentAttachments((prev) => [
      ...prev,
      {
        id: nextPendingId(),
        file,
        previewUrl: url,
        isImage: file.type.startsWith('image/'),
      },
    ]);
    setCommentExpanded(true);
    setAttachError(null);
  }

  function removePendingCommentAttachment(id: string) {
    setPendingCommentAttachments((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  }

  const commentCanSubmit =
    props.commentDraft.trim().length > 0 || pendingCommentAttachments.length > 0;

  function clearPastePreview() {
    setPastePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev.previewUrl);
      return null;
    });
  }

  function queuePastePreview(file: File, target: 'card' | 'comment') {
    const validationError = validateAttachmentFile(file);
    if (validationError) {
      setAttachError(validationError);
      return;
    }
    setPastePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev.previewUrl);
      return {
        file,
        previewUrl: URL.createObjectURL(file),
        target,
      };
    });
    setAttachError(null);
    if (target === 'comment') {
      setCommentExpanded(true);
    }
  }

  async function confirmPastePreview() {
    if (!pastePreview || attachUploadBusy) return;
    const { file, target, previewUrl } = pastePreview;
    setPastePreview(null);
    if (target === 'comment') {
      queueCommentAttachment(file, previewUrl);
      commentRef.current?.focus();
      return;
    }
    URL.revokeObjectURL(previewUrl);
    await handleFileUpload(file, 'card');
  }

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
    const validationError = validateAttachmentFile(file);
    if (validationError) {
      setAttachError(validationError);
      return;
    }
    if (target === 'comment') {
      queueCommentAttachment(file);
      if (commentFileInputRef.current) commentFileInputRef.current.value = '';
      return;
    }
    setAttachUploadBusy(true);
    setAttachError(null);
    try {
      await uploadCardAttachment(
        props.accessToken,
        props.workspaceId,
        props.card.id,
        file,
      );
      notifyAttachmentsChanged();
    } catch (e) {
      setAttachError(formatApiError(e));
    } finally {
      setAttachUploadBusy(false);
      if (cardFileInputRef.current) cardFileInputRef.current.value = '';
    }
  }

  async function submitCommentDraft() {
    if (!props.accessToken || props.commentSubmitBusy || attachUploadBusy) return;
    if (!commentCanSubmit) return;

    const text = props.commentDraft.trim();
    const pending = [...pendingCommentAttachments];
    setAttachUploadBusy(true);
    setAttachError(null);
    try {
      const markdownParts: string[] = [];
      const uploadedRows: CardAttachmentRow[] = [];
      for (const item of pending) {
        const row = await uploadCardAttachment(
          props.accessToken,
          props.workspaceId,
          props.card.id,
          item.file,
        );
        uploadedRows.push(row);
        markdownParts.push(attachmentMarkdown(row));
      }
      if (uploadedRows.length > 0) {
        setCardAttachments((prev) => {
          const known = new Set(prev.map((r) => r.id));
          const next = [...prev];
          for (const row of uploadedRows) {
            if (!known.has(row.id)) next.push(row);
          }
          return next;
        });
        notifyAttachmentsChanged();
      }
      const attachmentText = markdownParts.join('');
      const body = `${text}${attachmentText}`.trim();
      if (!body) return;

      await props.onSubmitComment(body);
      clearPendingCommentAttachments();
      setCommentExpanded(false);
      props.onCommentDraftChange('');
      setCommentSnapshot('');
    } catch (e) {
      setAttachError(formatApiError(e));
    } finally {
      setAttachUploadBusy(false);
    }
  }

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal || !props.accessToken) return;

    const onPaste = (event: ClipboardEvent) => {
      if (attachUploadBusy || props.busy) return;
      const file = getImageFileFromClipboardEvent(event);
      if (!file) return;

      event.preventDefault();
      const target =
        commentRef.current && document.activeElement === commentRef.current
          ? 'comment'
          : 'card';
      queuePastePreview(file, target);
    };

    modal.addEventListener('paste', onPaste);
    return () => modal.removeEventListener('paste', onPaste);
  }, [props.accessToken, props.busy, attachUploadBusy, props.card.id]);

  useEffect(() => {
    if (!pastePreview) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') clearPastePreview();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [pastePreview]);

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

  const cardMemberUserIds = useMemo(
    () => (props.assigneeId != null ? [props.assigneeId] : []),
    [props.assigneeId],
  );

  const popoverMembers = useMemo((): WorkspaceMember[] => {
    const list = [...props.members];
    if (props.currentUserId == null) return list;
    if (list.some((m) => m.userId === props.currentUserId || m.user.id === props.currentUserId)) {
      return list;
    }
    list.unshift({
      userId: props.currentUserId,
      user: resolveActivityUser(props.members, props.currentUserId, {
        name: props.currentUserName,
      }),
    });
    return list;
  }, [props.members, props.currentUserId, props.currentUserName]);

  const cardMemberUsers = useMemo(
    () => {
      if (props.assigneeId == null) return [];
      const row = props.members.find(
        (m) => m.userId === props.assigneeId || m.user.id === props.assigneeId,
      );
      return row ? [row.user] : [];
    },
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

  const attachmentIdsInComments = useMemo(
    () => attachmentIdsEmbeddedInComments(cardAttachments, props.comments),
    [cardAttachments, props.comments],
  );

  const activityItems = useMemo((): ActivityItem[] => {
    const items: ActivityItem[] = [
      { kind: 'created', at: props.card.createdAt, key: 'created' },
      ...cardAttachments
        .filter((row) => !attachmentIdsInComments.has(row.id))
        .map((row) => ({
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
  }, [
    props.card.createdAt,
    cardAttachments,
    props.comments,
    attachmentIdsInComments,
  ]);

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
      <CardDatesPopover
        key={`dates-${props.card.id}-${props.due}-${props.reminder}`}
        due={props.due}
        reminder={props.reminder}
        busy={props.busy}
        onClose={() => setPanel(null)}
        onSave={props.onDatesSave}
        onRemove={props.onDatesRemove}
      />
    );
  } else if (panel === 'members') {
    panelContent = (
      <CardMembersPopover
        selectedUserIds={cardMemberUserIds}
        members={popoverMembers}
        busy={props.busy}
        onClose={() => setPanel(null)}
        onSelectedChange={(ids) => {
          const next = ids[0] ?? null;
          props.onAssigneeChange(next);
        }}
      />
    );
  }

  return (
    <>
      <div
        className="trello-modal-backdrop trello-modal-backdrop--card-trello"
        role="presentation"
        onClick={() => !props.busy && props.onClose()}
      >
      <div
        ref={modalRef}
        className={[
          'trello-modal',
          'trello-modal-card-detail',
          'trello-modal-card-detail--trello',
          topbarOnCover ? 'trello-modal-card-detail--has-cover-band' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        role="dialog"
        aria-modal
        aria-label={props.card.title}
        onClick={(e) => e.stopPropagation()}
      >
        {isBannerCover ? (
          <div
            className={[
              'trello-card-detail-cover-band',
              props.card.coverImageUrl
                ? 'trello-card-detail-cover-band--image'
                : 'trello-card-detail-cover-band--color',
            ].join(' ')}
            style={
              hasColorCover && coverColor ? { backgroundColor: coverColor } : undefined
            }
          >
            {props.card.coverImageUrl ? (
              <img
                className="trello-card-detail-cover-band-img"
                src={props.card.coverImageUrl}
                alt=""
              />
            ) : null}
          </div>
        ) : null}

        <div
          className={
            topbarOnCover
              ? 'trello-card-detail-topbar trello-card-detail-topbar--on-cover'
              : 'trello-card-detail-topbar'
          }
        >
          <div className="trello-card-detail-list-badge" title={props.listName}>
            <span>{props.listName}</span>
          </div>
          <div className="trello-card-detail-topbar-actions">
            {props.accessToken ? (
              <CardDetailIconTooltip label="Обложка">
                <div className="trello-card-detail-cover-wrap-btn" ref={coverRef}>
                  <button
                    type="button"
                    className="trello-card-detail-icon-btn trello-card-detail-cover-btn"
                    aria-label="Обложка"
                    aria-expanded={coverPopoverOpen}
                    onClick={() => {
                      setMenuOpen(false);
                      setCoverPopoverOpen((v) => !v);
                    }}
                  >
                    <IconCover />
                  </button>
                  <CardColorCoverPopover
                    open={coverPopoverOpen}
                    colorPreset={props.card.coverColorPreset ?? null}
                    displayMode={
                      coverDisplayMode === 'FULL' ? 'FULL' : 'BANNER'
                    }
                    busy={false}
                    onClose={() => setCoverPopoverOpen(false)}
                    onSelectColor={(preset, mode) =>
                      void applyColorCover(preset, mode)
                    }
                    onRemoveCover={() => {
                      void applyColorCover(null, 'NONE');
                      setCoverPopoverOpen(false);
                    }}
                  />
                </div>
              </CardDetailIconTooltip>
            ) : null}
            <CardDetailIconTooltip label="Действия">
              <div className="trello-card-detail-menu-wrap" ref={menuRef}>
                <button
                  type="button"
                  className="trello-card-detail-icon-btn"
                  aria-label="Действия"
                  aria-expanded={menuOpen}
                  onClick={() => {
                    setCoverPopoverOpen(false);
                    setMenuOpen((v) => !v);
                  }}
                >
                  <span className="trello-card-detail-ellipsis" aria-hidden>
                    •••
                  </span>
                </button>
                {menuOpen ? (
                  <div className="trello-card-detail-menu" role="menu">
                    {props.canArchive !== false ? (
                      <button
                        type="button"
                        role="menuitem"
                        disabled={props.busy}
                        onClick={() => {
                          setMenuOpen(false);
                          props.onArchive();
                        }}
                      >
                        В архив
                      </button>
                    ) : null}
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
                      Удалить
                    </button>
                  </div>
                ) : null}
              </div>
            </CardDetailIconTooltip>
            <CardDetailIconTooltip label="Закрыть">
              <button
                type="button"
                className="trello-card-detail-icon-btn trello-card-detail-close-btn"
                aria-label="Закрыть"
                onClick={() => !props.busy && props.onClose()}
              >
                ×
              </button>
            </CardDetailIconTooltip>
          </div>
        </div>

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
                      maxLength={CARD_TITLE_MAX_LENGTH}
                      disabled={props.busy}
                      rows={2}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey) {
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

            <div className="trello-card-detail-meta-rows">
              {(props.card.labels?.length ?? 0) > 0 ? (
                <div className="trello-card-detail-meta-row">
                  <CardLabelStrip labels={props.card.labels} />
                </div>
              ) : null}
              {cardMemberUsers.length > 0 ? (
                <div className="trello-card-detail-meta-row trello-card-detail-meta-row--members">
                  <CardMembersStrip
                    members={cardMemberUsers}
                    onAddClick={() => togglePanel('members')}
                    addDisabled={props.busy}
                  />
                </div>
              ) : null}
            </div>

            <div
              className={
                panel === 'members'
                  ? 'trello-card-detail-add-row-wrap trello-card-detail-add-row-wrap--members-open'
                  : 'trello-card-detail-add-row-wrap'
              }
            >
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
              </div>

              {panelContent}
            </div>

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
                    onAttach={props.accessToken ? () => openCardFilePicker() : undefined}
                    attachDisabled={attachUploadBusy || props.busy}
                    attachLabel="Прикрепить файл"
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
                {commentExpanded && props.currentUserId != null ? (
                  <CommentAvatarBubble
                    user={resolveActivityUser(props.members, props.currentUserId, {
                      name: props.currentUserName,
                    })}
                    profileTo="/profile/character"
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
                          commentCanSubmit
                        ) {
                          e.preventDefault();
                          void submitCommentDraft();
                        }
                      }}
                    />
                  </div>
                  {commentExpanded && pendingCommentAttachments.length > 0 ? (
                    <ul className="trello-compose-attachments" aria-label="Вложения к комментарию">
                      {pendingCommentAttachments.map((item) => (
                        <li key={item.id} className="trello-compose-attachment">
                          {item.isImage ? (
                            <img
                              className="trello-compose-attachment-img"
                              src={item.previewUrl}
                              alt={item.file.name}
                            />
                          ) : (
                            <span className="trello-compose-attachment-file">{item.file.name}</span>
                          )}
                          <button
                            type="button"
                            className="trello-compose-attachment-remove"
                            aria-label={`Убрать ${item.file.name}`}
                            disabled={attachUploadBusy || props.commentSubmitBusy}
                            onClick={() => removePendingCommentAttachment(item.id)}
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {commentExpanded ? (
                    <EditorFooter
                      saveLabel="Сохранить"
                      saving={props.commentSubmitBusy || attachUploadBusy}
                      saveDisabled={
                        props.commentSubmitBusy || attachUploadBusy || !commentCanSubmit
                      }
                      onSave={() => void submitCommentDraft()}
                      onCancel={() => {
                        props.onCommentDraftChange(commentSnapshot);
                        clearPendingCommentAttachments();
                        setCommentExpanded(false);
                        commentRef.current?.blur();
                      }}
                      onAttach={() => openCommentFilePicker()}
                      attachDisabled={attachUploadBusy || props.commentSubmitBusy}
                      attachLabel="Прикрепить файл к комментарию"
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
                    const creatorUser =
                      props.currentUserId != null
                        ? resolveActivityUser(props.members, props.currentUserId, {
                            name: props.currentUserName,
                          })
                        : resolveActivityUser(props.members, -1, { name: props.currentUserName });
                    return (
                      <li key={item.key} className="trello-card-detail-activity-item">
                        <CommentAvatarBubble
                          user={creatorUser}
                          profileTo={
                            props.currentUserId != null ? '/profile/character' : '/workspaces'
                          }
                        />
                        <div className="trello-card-detail-activity-body">
                          <p>
                            <strong>{activityUserDisplayName(creatorUser)}</strong> добавил(а) эту
                            карточку в список <strong>{props.listName}</strong>
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
                          user={resolveActivityUser(props.members, a.uploader.id, a.uploader)}
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
                  const isAuthor = isCommentAuthor(c, props.currentUserId);
                  const canDeleteComment = isAuthor || props.canManageWorkspace;
                  const authorProfileTo = isAuthor ? '/profile/character' : userProfilePath(c.userId);
                  return (
                    <li key={item.key} className="trello-card-detail-activity-item">
                      <CommentAvatarBubble user={c.user} profileTo={authorProfileTo} />
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
                              {canDeleteComment ? (
                                <button
                                  type="button"
                                  className="trello-card-detail-text-btn trello-card-detail-text-btn--danger"
                                  disabled={props.commentEditBusy}
                                  onClick={() => props.onDeleteComment(c)}
                                >
                                  Удалить
                                </button>
                              ) : null}
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
                            <div className="trello-card-detail-activity-meta">
                              <time
                                className="trello-card-detail-activity-time"
                                dateTime={c.createdAt}
                              >
                                {props.formatCommentRelativeAgo(c.createdAt, props.nowTick)}
                              </time>
                              {canDeleteComment ? (
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
                                  <button
                                    type="button"
                                    className="trello-card-comment-link trello-card-comment-link-danger"
                                    onClick={() => props.onDeleteComment(c)}
                                  >
                                    Удалить
                                  </button>
                                </div>
                              ) : null}
                            </div>
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

      {pastePreview ? (
        <CardPasteAttachmentPrompt
          previewUrl={pastePreview.previewUrl}
          busy={attachUploadBusy}
          onConfirm={() => void confirmPastePreview()}
          onCancel={clearPastePreview}
        />
      ) : null}
    </>
  );
}
