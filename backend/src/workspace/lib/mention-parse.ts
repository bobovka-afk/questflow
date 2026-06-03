/** Token inserted in comment body: @[user:123] */
const MENTION_TOKEN_RE = /@\[user:(\d+)\]/g;

export function extractMentionedUserIds(body: string): number[] {
  const ids = new Set<number>();
  for (const match of body.matchAll(MENTION_TOKEN_RE)) {
    const id = Number(match[1]);
    if (Number.isInteger(id) && id > 0) {
      ids.add(id);
    }
  }
  return [...ids];
}

export function formatMentionToken(userId: number): string {
  return `@[user:${userId}]`;
}
