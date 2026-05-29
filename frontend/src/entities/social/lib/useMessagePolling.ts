import { useCallback, useEffect, useRef } from 'react';
import { fetchMessagesWith, fetchSentMessageReceipts } from '../api/socialApi';
import type { DirectMessageView, MessageReadReceipt } from '../model/types';

const DEFAULT_INTERVAL_MS = 5000;

export function useMessagePolling(options: {
  accessToken: string;
  peerUserId: number | null;
  enabled: boolean;
  intervalMs?: number;
  onNewMessages: (messages: DirectMessageView[]) => void;
  onReceiptsUpdate?: (receipts: MessageReadReceipt[]) => void;
}) {
  const lastIdRef = useRef(0);
  const onNewRef = useRef(options.onNewMessages);
  const onReceiptsRef = useRef(options.onReceiptsUpdate);
  onNewRef.current = options.onNewMessages;
  onReceiptsRef.current = options.onReceiptsUpdate;

  const seedLastMessageId = useCallback((id: number) => {
    if (id > lastIdRef.current) lastIdRef.current = id;
  }, []);

  useEffect(() => {
    lastIdRef.current = 0;
  }, [options.peerUserId]);

  useEffect(() => {
    if (!options.enabled || options.peerUserId == null) return;

    let cancelled = false;
    const intervalMs = options.intervalMs ?? DEFAULT_INTERVAL_MS;

    const poll = async () => {
      try {
        const since = lastIdRef.current > 0 ? lastIdRef.current : undefined;
        const batchPromise = fetchMessagesWith(
          options.accessToken,
          options.peerUserId!,
          since,
        );
        const receiptsPromise = fetchSentMessageReceipts(
          options.accessToken,
          options.peerUserId!,
        ).catch(() => [] as MessageReadReceipt[]);

        const [batch, receipts] = await Promise.all([batchPromise, receiptsPromise]);
        if (cancelled) return;
        if (receipts.length > 0) {
          onReceiptsRef.current?.(receipts);
        }
        if (batch.length > 0) {
          const maxId = Math.max(...batch.map((m) => m.id));
          if (maxId > lastIdRef.current) {
            lastIdRef.current = maxId;
          }
          onNewRef.current(batch);
        }
      } catch {
        /* ignore transient poll errors */
      }
    };

    const startDelay = window.setTimeout(() => void poll(), intervalMs);
    const timer = window.setInterval(() => void poll(), intervalMs);

    return () => {
      cancelled = true;
      window.clearTimeout(startDelay);
      window.clearInterval(timer);
    };
  }, [
    options.accessToken,
    options.peerUserId,
    options.enabled,
    options.intervalMs,
  ]);

  return { seedLastMessageId };
}
