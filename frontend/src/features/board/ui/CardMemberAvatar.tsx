import { avatarInitials, avatarSrcFromPath } from '@entities/user';
import type { ActivityUserBrief } from '@entities/user';
import { useState } from 'react';

type Props = {
  user: ActivityUserBrief;
  size?: 'sm' | 'md';
  className?: string;
};

export function CardMemberAvatar({ user, size = 'md', className }: Props) {
  const [broken, setBroken] = useState(false);
  const label = user.name?.trim() || 'Участник';
  const src = avatarSrcFromPath(user.avatarPath);

  const sizeClass =
    size === 'sm'
      ? 'trello-card-member-avatar--sm'
      : 'trello-card-member-avatar--md';

  return (
    <span
      className={['trello-card-member-avatar', sizeClass, className]
        .filter(Boolean)
        .join(' ')}
      aria-hidden
    >
      {src && !broken ? (
        <img
          src={src}
          alt=""
          onError={() => setBroken(true)}
        />
      ) : (
        <span className="trello-card-member-avatar__initials">
          {avatarInitials(label)}
        </span>
      )}
    </span>
  );
}
