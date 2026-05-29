import type { DirectMessageView, MessageReadReceipt } from '../model/types';

export function applyMessageReceipts(
  messages: DirectMessageView[],
  receipts: MessageReadReceipt[],
): DirectMessageView[] {
  if (receipts.length === 0) return messages;
  const byId = new Map(receipts.map((r) => [r.id, r.readAt]));
  return messages.map((m) => {
    const readAt = byId.get(m.id);
    if (readAt === undefined) return m;
    return { ...m, readAt };
  });
}
