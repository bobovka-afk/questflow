import { useState } from 'react';
import { formatApiError } from '@shared/api';
import {
  blockUser,
  fetchUserRelation,
  unblockUser,
  type UserRelationView,
} from '@entities/social';

type Props = {
  accessToken: string;
  userId: number;
  relation: UserRelationView | null;
  onRelationChange: (relation: UserRelationView) => void;
  onError?: (message: string | null) => void;
};

export function SocialUserBlockButton({
  accessToken,
  userId,
  relation,
  onRelationChange,
  onError,
}: Props) {
  const [busy, setBusy] = useState(false);

  if (relation == null) return null;

  if (relation.blockedByThem && !relation.blockedByMe) {
    return (
      <span className="trello-cell-meta">Этот пользователь ограничил взаимодействие с вами</span>
    );
  }

  async function handleBlock() {
    if (!window.confirm('Заблокировать этого пользователя? Сообщения и заявки в друзья будут недоступны.')) {
      return;
    }
    setBusy(true);
    onError?.(null);
    try {
      await blockUser(accessToken, userId);
      onRelationChange(await fetchUserRelation(accessToken, userId));
    } catch (e) {
      onError?.(formatApiError(e));
    } finally {
      setBusy(false);
    }
  }

  async function handleUnblock() {
    setBusy(true);
    onError?.(null);
    try {
      await unblockUser(accessToken, userId);
      onRelationChange(await fetchUserRelation(accessToken, userId));
    } catch (e) {
      onError?.(formatApiError(e));
    } finally {
      setBusy(false);
    }
  }

  if (relation.blockedByMe) {
    return (
      <button
        type="button"
        className="trello-btn trello-btn-ghost trello-btn-sm"
        disabled={busy}
        onClick={() => void handleUnblock()}
      >
        {busy ? '…' : 'Разблокировать'}
      </button>
    );
  }

  return (
    <button
      type="button"
      className="trello-btn trello-btn-danger-ghost trello-btn-sm"
      disabled={busy}
      onClick={() => void handleBlock()}
    >
      {busy ? '…' : 'Заблокировать'}
    </button>
  );
}
