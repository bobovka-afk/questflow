import { characterPortraitUrl } from '@entities/character';
import { avatarInitials, avatarSrcFromPath } from '@entities/user';
import type { SocialUserSummary } from '../model/types';

export function socialUserDisplayName(user: SocialUserSummary): string {
  return user.characterName?.trim() || user.name;
}

type Props = {
  user: SocialUserSummary;
  className?: string;
};

export function SocialUserCharacterAvatar({ user, className }: Props) {
  const label = socialUserDisplayName(user);
  const rootClass = ['trello-social-friend-avatar', className].filter(Boolean).join(' ');

  if (user.characterAvatarPreset) {
    return (
      <span className={rootClass} aria-hidden>
        <img
          src={characterPortraitUrl(user.characterAvatarPreset)}
          alt=""
          className="trello-social-friend-avatar-img"
          loading="lazy"
        />
      </span>
    );
  }

  const accountAvatarSrc = avatarSrcFromPath(user.avatarPath);
  if (accountAvatarSrc) {
    return (
      <span className={rootClass} aria-hidden>
        <img src={accountAvatarSrc} alt="" className="trello-social-friend-avatar-img" />
      </span>
    );
  }

  return (
    <span className={rootClass} aria-hidden>
      <span className="trello-social-friend-avatar-fallback">{avatarInitials(label)}</span>
    </span>
  );
}
