import { extractMentionedUserIds, formatMentionToken } from '../mention-parse';

describe('mention-parse', () => {
  it('formatMentionToken', () => {
    expect(formatMentionToken(42)).toBe('@[user:42]');
  });

  it('extractMentionedUserIds dedupes', () => {
    const body = `${formatMentionToken(1)} hi ${formatMentionToken(1)} ${formatMentionToken(2)}`;
    expect(extractMentionedUserIds(body).sort()).toEqual([1, 2]);
  });

  it('ignores invalid ids', () => {
    expect(extractMentionedUserIds('@[user:0] @[user:abc]')).toEqual([]);
  });
});
