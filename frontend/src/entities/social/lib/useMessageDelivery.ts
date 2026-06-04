import { useCallback, useEffect, useRef, useState } from 'react';
import { API_URL } from '@shared/api';
import type { DirectMessageView, MessageReadReceipt } from '../model/types';
import { useMessagePolling } from './useMessagePolling';

const POLL_FALLBACK_MS = 5000;

/** SSE via EventSource (?accessToken=); falls back to REST poll. */
export function useMessageDelivery(options: {
  accessToken: string;
  peerUserId: number | null;
  enabled: boolean;
  onNewMessages: (messages: DirectMessageView[]) => void;
  onReceiptsUpdate?: (receipts: MessageReadReceipt[]) => void;
}) {
  const [sseOk, setSseOk] = useState(false);
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
    setSseOk(false);
  }, [options.peerUserId]);

  useEffect(() => {
    if (!options.enabled || options.peerUserId == null || !options.accessToken) {
      return;
    }
    const peerId = options.peerUserId;
    const token = encodeURIComponent(options.accessToken);
    const url = `${API_URL}/social/messages/stream/${peerId}?accessToken=${token}`;
    const es = new EventSource(url);

    es.onmessage = (ev) => {
      try {
        const payload = JSON.parse(ev.data as string) as {
          messages?: DirectMessageView[];
        };
        const batch = payload.messages ?? [];
        if (batch.length > 0) {
          setSseOk(true);
          const maxId = Math.max(...batch.map((m) => m.id));
          if (maxId > lastIdRef.current) lastIdRef.current = maxId;
          onNewRef.current(batch);
        }
      } catch {
        /* ignore malformed */
      }
    };

    es.onerror = () => {
      setSseOk(false);
      es.close();
    };

    return () => {
      es.close();
      setSseOk(false);
    };
  }, [options.accessToken, options.peerUserId, options.enabled]);

  useMessagePolling({
    accessToken: options.accessToken,
    peerUserId: options.peerUserId,
    enabled: options.enabled && !sseOk,
    intervalMs: POLL_FALLBACK_MS,
    onNewMessages: (batch) => {
      for (const m of batch) {
        if (m.id > lastIdRef.current) lastIdRef.current = m.id;
      }
      onNewRef.current(batch);
    },
    onReceiptsUpdate: (receipts) => onReceiptsRef.current?.(receipts),
  });

  return { seedLastMessageId };
}
