import { useMemo } from 'react';
import { SpaLink } from '@shared/lib/navigation';
import { userProfilePath } from '@entities/user';
import {
  buildMentionNameMap,
  parseCommentBodySegments,
} from '../lib/mentionBody';

type MemberLike = { user: { id: number; name: string } };

type Props = {
  body: string;
  members: MemberLike[];
  className?: string;
};

export function CommentBodyText({ body, members, className }: Props) {
  const segments = useMemo(() => {
    const map = buildMentionNameMap(members);
    return parseCommentBodySegments(body, map);
  }, [body, members]);

  return (
    <p className={className ?? 'trello-card-comment-text'}>
      {segments.map((seg, i) => {
        if (seg.type === 'text') {
          return <span key={i}>{seg.value}</span>;
        }
        return (
          <SpaLink
            key={i}
            className="trello-mention-link"
            to={userProfilePath(seg.userId)}
          >
            @{seg.displayName}
          </SpaLink>
        );
      })}
    </p>
  );
}
