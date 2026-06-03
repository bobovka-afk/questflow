/** Matches backend token: @[user:123] */
const MENTION_TOKEN_RE = /@\[user:(\d+)\]/g;

export type CommentBodySegment =
  | { type: 'text'; value: string }
  | { type: 'mention'; userId: number; displayName: string };

export function buildMentionNameMap(
  members: { user: { id: number; name: string } }[],
): Map<number, string> {
  const map = new Map<number, string>();
  for (const m of members) {
    map.set(m.user.id, m.user.name);
  }
  return map;
}

export function parseCommentBodySegments(
  body: string,
  nameByUserId: Map<number, string>,
): CommentBodySegment[] {
  if (!body) return [];

  const segments: CommentBodySegment[] = [];
  let lastIndex = 0;

  for (const match of body.matchAll(MENTION_TOKEN_RE)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      segments.push({ type: 'text', value: body.slice(lastIndex, index) });
    }
    const userId = Number(match[1]);
    const displayName = nameByUserId.get(userId) ?? `Участник #${userId}`;
    segments.push({ type: 'mention', userId, displayName });
    lastIndex = index + match[0].length;
  }

  if (lastIndex < body.length) {
    segments.push({ type: 'text', value: body.slice(lastIndex) });
  }

  if (segments.length === 0) {
    return [{ type: 'text', value: body }];
  }

  return segments;
}
