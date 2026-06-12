import type { ActivityUserBrief } from '@entities/user';
import { CardMemberAvatar } from './CardMemberAvatar';

type Props = {
  label?: string;
  members: ActivityUserBrief[];
  onAddClick: () => void;
  addDisabled?: boolean;
};

export function CardMembersStrip({
  label = 'Участники',
  members,
  onAddClick,
  addDisabled = false,
}: Props) {
  return (
    <div className="trello-card-members-strip">
      <span className="trello-card-members-strip-label">{label}</span>
      <div className="trello-card-members-strip-avatars" aria-label={label}>
        {members.map((user) => (
          <span
            key={user.id}
            className="trello-card-members-strip-avatar-wrap"
            title={user.name}
          >
            <CardMemberAvatar user={user} size="sm" />
          </span>
        ))}
        <button
          type="button"
          className="trello-card-members-strip-add"
          aria-label="Добавить участника"
          disabled={addDisabled}
          onClick={onAddClick}
        >
          +
        </button>
      </div>
    </div>
  );
}
