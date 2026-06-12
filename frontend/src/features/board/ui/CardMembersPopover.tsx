import { useMemo, useState } from 'react';
import type { ActivityUserBrief } from '@entities/user';
import { CardMemberAvatar } from './CardMemberAvatar';

export type CardMembersPopoverMember = {
  userId: number;
  user: ActivityUserBrief;
};

type Props = {
  selectedUserIds: number[];
  members: CardMembersPopoverMember[];
  busy?: boolean;
  onClose: () => void;
  onSelectedChange: (userIds: number[]) => void;
};

function memberName(m: CardMembersPopoverMember) {
  return m.user.name?.trim() || 'Участник';
}

export function CardMembersPopover({
  selectedUserIds,
  members,
  busy = false,
  onClose,
  onSelectedChange,
}: Props) {
  const [query, setQuery] = useState('');

  const selectedSet = useMemo(
    () => new Set(selectedUserIds),
    [selectedUserIds],
  );

  const boardMembers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) =>
      memberName(m).toLowerCase().includes(q),
    );
  }, [members, query]);

  function toggleMember(userId: number, add: boolean) {
    if (add) {
      if (selectedSet.has(userId)) return;
      onSelectedChange([...selectedUserIds, userId]);
      return;
    }
    onSelectedChange(selectedUserIds.filter((id) => id !== userId));
  }

  return (
    <div
      className="trello-card-members-popover trello-card-detail-popover trello-card-detail-popover--members"
      role="dialog"
      aria-label="Участники"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="trello-card-members-popover-head">
        <span className="trello-card-members-popover-title">Участники</span>
        <button
          type="button"
          className="trello-card-members-popover-close"
          aria-label="Закрыть"
          disabled={busy}
          onClick={onClose}
        >
          ×
        </button>
      </div>

      <label className="trello-card-members-popover-search">
        <span className="trello-sr-only">Поиск участников</span>
        <input
          type="search"
          className="trello-input trello-card-members-popover-search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск участников"
          disabled={busy}
          autoFocus
        />
      </label>

      <p className="trello-card-members-popover-subtitle">Участники доски</p>

      {boardMembers.length === 0 ? (
        <p className="trello-card-members-popover-empty">Никого не найдено</p>
      ) : (
        <ul className="trello-card-members-popover-list trello-card-members-popover-list--board">
          {boardMembers.map((m) => {
            const onCard = selectedSet.has(m.userId);
            if (onCard) {
              return (
                <li key={m.userId}>
                  <div className="trello-card-members-popover-row">
                    <CardMemberAvatar user={m.user} size="sm" />
                    <span className="trello-card-members-popover-name">
                      {memberName(m)}
                    </span>
                    <button
                      type="button"
                      className="trello-card-members-popover-remove"
                      aria-label={`Убрать ${memberName(m)} с карточки`}
                      disabled={busy}
                      onClick={() => toggleMember(m.userId, false)}
                    >
                      ×
                    </button>
                  </div>
                </li>
              );
            }
            return (
              <li key={m.userId}>
                <button
                  type="button"
                  className="trello-card-members-popover-pick"
                  disabled={busy}
                  onClick={() => toggleMember(m.userId, true)}
                >
                  <CardMemberAvatar user={m.user} size="sm" />
                  <span>{memberName(m)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
