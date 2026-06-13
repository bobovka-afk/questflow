import { IconAttach } from '@shared/ui/icons/IconAttach';
import { IconComment } from '@shared/ui/icons/IconComment';

type Props = {
  attachmentCount?: number;
  commentCount?: number;
};

export function CardListBadges({ attachmentCount = 0, commentCount = 0 }: Props) {
  if (attachmentCount <= 0 && commentCount <= 0) return null;

  return (
    <div className="trello-card-badges">
      {commentCount > 0 ? (
        <span className="trello-card-badge trello-card-comment-indicator" title="Комментарии">
          <IconComment size={14} className="trello-card-badge-icon" />
          <span className="trello-card-meta-count">{commentCount}</span>
        </span>
      ) : null}
      {attachmentCount > 0 ? (
        <span className="trello-card-badge trello-card-attach-indicator" title="Вложения">
          <IconAttach size={12} className="trello-card-badge-icon trello-card-badge-icon--attach" />
          <span className="trello-card-meta-count">{attachmentCount}</span>
        </span>
      ) : null}
    </div>
  );
}
