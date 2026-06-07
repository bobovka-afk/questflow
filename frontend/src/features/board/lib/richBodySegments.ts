import type { CommentBodySegment } from './mentionBody';

export type RichBodyPart =
  | { type: 'text'; value: string }
  | { type: 'mention'; userId: number; displayName: string }
  | { type: 'bold'; value: string }
  | { type: 'italic'; value: string }
  | { type: 'link'; label: string; href: string }
  | { type: 'image'; alt: string; src: string };

const MD_IMAGE_RE = /!\[([^\]]*)\]\(([^)]+)\)/;
const MD_LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/;
const BOLD_RE = /\*\*([^*]+)\*\*/;
const ITALIC_RE = /\*([^*]+)\*/;

function parseInlineMarkdown(text: string): RichBodyPart[] {
  if (!text) return [];
  const parts: RichBodyPart[] = [];
  let rest = text;

  while (rest.length > 0) {
    const candidates: { index: number; len: number; part: RichBodyPart }[] = [];

    const img = MD_IMAGE_RE.exec(rest);
    if (img?.index !== undefined) {
      candidates.push({
        index: img.index,
        len: img[0].length,
        part: { type: 'image', alt: img[1], src: img[2] },
      });
    }
    const link = MD_LINK_RE.exec(rest);
    if (link?.index !== undefined) {
      candidates.push({
        index: link.index,
        len: link[0].length,
        part: { type: 'link', label: link[1], href: link[2] },
      });
    }
    const bold = BOLD_RE.exec(rest);
    if (bold?.index !== undefined) {
      candidates.push({
        index: bold.index,
        len: bold[0].length,
        part: { type: 'bold', value: bold[1] },
      });
    }
    const italic = ITALIC_RE.exec(rest);
    if (italic?.index !== undefined) {
      candidates.push({
        index: italic.index,
        len: italic[0].length,
        part: { type: 'italic', value: italic[1] },
      });
    }

    if (candidates.length === 0) {
      parts.push({ type: 'text', value: rest });
      break;
    }

    const first = candidates.reduce((a, b) => (a.index <= b.index ? a : b));
    if (first.index > 0) {
      parts.push({ type: 'text', value: rest.slice(0, first.index) });
    }
    parts.push(first.part);
    rest = rest.slice(first.index + first.len);
  }

  return parts;
}

export function richPartsFromCommentSegments(segments: CommentBodySegment[]): RichBodyPart[] {
  const out: RichBodyPart[] = [];
  for (const seg of segments) {
    if (seg.type === 'mention') {
      out.push({
        type: 'mention',
        userId: seg.userId,
        displayName: seg.displayName,
      });
      continue;
    }
    out.push(...parseInlineMarkdown(seg.value));
  }
  return out;
}
