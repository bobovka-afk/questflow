import { formatFriendCode, type UserRelationView } from '@entities/social';
import { SocialUserBlockButton } from '@widgets/social-user-block/SocialUserBlockButton';

type Props = {
  accessToken: string;
  userId: number;
  friendCode: number | null | undefined;
  relation: UserRelationView;
  socialBusy: boolean;
  onAddFriend: () => void;
  onMessage: () => void;
  onRelationChange: (relation: UserRelationView) => void;
  onError: (message: string | null) => void;
  /** foot — горизонтальная панель; sidebar — колонка «Связь» (variant 4) */
  layout?: 'foot' | 'sidebar';
};

export function UserCharacterProfileFoot({
  accessToken,
  userId,
  friendCode,
  relation,
  socialBusy,
  onAddFriend,
  onMessage,
  onRelationChange,
  onError,
  layout = 'foot',
}: Props) {
  const sidebar = layout === 'sidebar';
  const socialBlocked =
    relation.blockedByMe === true || relation.blockedByThem === true;

  const showAddFriend =
    !socialBlocked && !relation.isFriend && !relation.outgoingRequestId;

  const showOutgoing =
    !socialBlocked && relation.outgoingRequestId != null && !relation.isFriend;

  const showFriendChip = !socialBlocked && relation.isFriend;

  const showMessage = relation.canMessage;

  const showActions =
    showAddFriend ||
    showMessage ||
    !relation.blockedByThem ||
    relation.blockedByMe;

  const chips = (
    <>
      {friendCode != null && (
        <span className="trello-character-profile-foot-chip">
          ID · {formatFriendCode(friendCode)}
        </span>
      )}
      {showFriendChip && (
        <span className="trello-character-profile-foot-chip trello-character-profile-foot-chip--status">
          ✓ В друзьях
        </span>
      )}
      {showOutgoing && (
        <span className="trello-character-profile-foot-chip">Заявка отправлена</span>
      )}
      {relation.blockedByThem && !relation.blockedByMe && (
        <span className="trello-character-profile-foot-chip trello-character-profile-foot-chip--muted">
          Взаимодействие ограничено
        </span>
      )}
      {relation.blockedByMe && (
        <span className="trello-character-profile-foot-chip trello-character-profile-foot-chip--muted">
          Заблокирован
        </span>
      )}
    </>
  );

  const actions =
    relation.blockedByThem && !relation.blockedByMe ? (
      <p className="trello-character-profile-foot-notice">
        Этот пользователь ограничил взаимодействие с вами
      </p>
    ) : showActions ? (
      <>
        {showAddFriend && (
          <button
            type="button"
            className="trello-character-profile-foot-action trello-character-profile-foot-action--primary"
            disabled={socialBusy || friendCode == null}
            onClick={onAddFriend}
          >
            {relation.incomingRequestId != null ? 'Принять заявку' : 'Добавить в друзья'}
          </button>
        )}
        {showMessage && (
          <button
            type="button"
            className="trello-character-profile-foot-action"
            onClick={onMessage}
          >
            <span className="trello-character-profile-foot-action-icon" aria-hidden>
              ✉
            </span>
            Написать
          </button>
        )}
        <SocialUserBlockButton
          accessToken={accessToken}
          userId={userId}
          relation={relation}
          onRelationChange={onRelationChange}
          onError={onError}
          appearance="foot"
        />
      </>
    ) : null;

  if (sidebar) {
    return (
      <div className="trello-character-profile-side">
        <div className="trello-character-profile-side-block">
          <div className="trello-character-profile-side-label">Связь</div>
          <div className="trello-character-profile-side-chips">{chips}</div>
          {relation.blockedByThem && !relation.blockedByMe ? actions : null}
        </div>
        {!(relation.blockedByThem && !relation.blockedByMe) && actions ? (
          <div className="trello-character-profile-side-actions">{actions}</div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="trello-character-profile-foot">
      <div className="trello-character-profile-foot-meta">{chips}</div>
      {relation.blockedByThem && !relation.blockedByMe ? (
        actions
      ) : showActions && actions ? (
        <div className="trello-character-profile-foot-actions">{actions}</div>
      ) : null}
    </div>
  );
}
