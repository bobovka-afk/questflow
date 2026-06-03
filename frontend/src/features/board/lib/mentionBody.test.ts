import { describe, expect, it } from 'vitest';
import { buildMentionNameMap, parseCommentBodySegments } from './mentionBody';

describe('mentionBody', () => {
  const nameMap = buildMentionNameMap([
    { user: { id: 5, name: 'Аня' } },
    { user: { id: 7, name: 'Борис' } },
  ]);

  it('parses plain text', () => {
    expect(parseCommentBodySegments('Привет', nameMap)).toEqual([
      { type: 'text', value: 'Привет' },
    ]);
  });

  it('parses mention token into display name', () => {
    const segments = parseCommentBodySegments(
      'Смотри @[user:5] и @[user:7]',
      nameMap,
    );
    expect(segments).toEqual([
      { type: 'text', value: 'Смотри ' },
      { type: 'mention', userId: 5, displayName: 'Аня' },
      { type: 'text', value: ' и ' },
      { type: 'mention', userId: 7, displayName: 'Борис' },
    ]);
  });

  it('falls back when user unknown', () => {
    const segments = parseCommentBodySegments('@[user:99]', nameMap);
    expect(segments[0]).toMatchObject({
      type: 'mention',
      userId: 99,
      displayName: 'Участник #99',
    });
  });
});
