import { describe, expect, it } from 'vitest';
import { applyMessageReceipts } from './applyMessageReceipts';

const base = {
  senderId: 1,
  recipientId: 2,
  body: 'hi',
  createdAt: '2026-05-28T12:00:00.000Z',
};

describe('applyMessageReceipts', () => {
  it('returns same array when receipts empty', () => {
    const messages = [{ id: 1, readAt: null, ...base }];
    expect(applyMessageReceipts(messages, [])).toBe(messages);
  });

  it('merges readAt from receipts by message id', () => {
    const messages = [
      { id: 1, readAt: null, ...base },
      { id: 2, readAt: null, ...base },
    ];
    const readAt = '2026-05-28T12:05:00.000Z';
    const result = applyMessageReceipts(messages, [
      { id: 1, readAt },
      { id: 99, readAt: 'ignored' },
    ]);
    expect(result[0].readAt).toBe(readAt);
    expect(result[1].readAt).toBeNull();
  });
});
