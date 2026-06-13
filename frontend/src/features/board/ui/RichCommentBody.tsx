import { useMemo } from 'react';
import { SpaLink } from '@shared/lib/navigation';
import { userProfilePath } from '@entities/user';
import { buildMentionNameMap, parseCommentBodySegments } from '../lib/mentionBody';
import { richPartsFromCommentSegments, type RichBodyPart } from '../lib/richBodySegments';

type MemberLike = { user: { id: number; name: string } };

type Props = {
  body: string;
  members: MemberLike[];
  className?: string;
  onImageClick?: (src: string, alt: string) => void;
};

function renderPart(
  part: RichBodyPart,
  key: number,
  onImageClick?: (src: string, alt: string) => void,
) {
  switch (part.type) {
    case 'text':
      return <span key={key}>{part.value}</span>;
    case 'bold':
      return <strong key={key}>{part.value}</strong>;
    case 'italic':
      return <em key={key}>{part.value}</em>;
    case 'link':
      return (
        <a
          key={key}
          className="trello-rich-link"
          href={part.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {part.label}
        </a>
      );
    case 'image':
      if (onImageClick) {
        return (
          <button
            key={key}
            type="button"
            className="trello-rich-image-wrap"
            aria-label={part.alt ? `Открыть изображение ${part.alt}` : 'Открыть изображение'}
            onClick={() => onImageClick(part.src, part.alt)}
          >
            <img className="trello-rich-image" src={part.src} alt={part.alt} />
          </button>
        );
      }
      return (
        <a
          key={key}
          className="trello-rich-image-wrap"
          href={part.src}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="trello-rich-image" src={part.src} alt={part.alt} />
        </a>
      );
    case 'mention':
      return (
        <SpaLink key={key} className="trello-mention-link" to={userProfilePath(part.userId)}>
          @{part.displayName}
        </SpaLink>
      );
    default:
      return null;
  }
}

export function RichCommentBody({ body, members, className, onImageClick }: Props) {
  const parts = useMemo(() => {
    const map = buildMentionNameMap(members);
    const segments = parseCommentBodySegments(body, map);
    return richPartsFromCommentSegments(segments);
  }, [body, members]);

  return (
    <div className={className ?? 'trello-card-comment-text trello-rich-comment-body'}>
      {parts.map((p, i) => renderPart(p, i, onImageClick))}
    </div>
  );
}
