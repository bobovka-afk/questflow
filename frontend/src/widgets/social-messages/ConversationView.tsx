import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { formatApiError, type ApiError } from '@shared/api';
import {
  fetchMessagesWith,
  fetchSentMessageReceipts,
  fetchUserRelation,
  markMessagesRead,
  sendDirectMessage,
  useMessagePolling,
  type DirectMessageView,
  type SocialUserSummary,
} from '@entities/social';
import { applyMessageReceipts } from '@entities/social/lib/applyMessageReceipts';
import { MessageReadTicks } from './MessageReadTicks';

type Props = {
  accessToken: string;
  currentUserId: number;
  peer: SocialUserSummary;
  enabled: boolean;
  onInboxChange?: () => void;
  onPeerRead?: (peerUserId: number) => void;
};

function displayName(user: SocialUserSummary): string {
  return user.characterName?.trim() || user.name;
}

async function loadReceiptsSafe(
  accessToken: string,
  peerUserId: number,
): Promise<MessageReadReceipt[]> {
  try {
    return await fetchSentMessageReceipts(accessToken, peerUserId);
  } catch {
    return [];
  }
}

export function ConversationView({
  accessToken,
  currentUserId,
  peer,
  enabled,
  onInboxChange,
  onPeerRead,
}: Props) {
  const [messages, setMessages] = useState<DirectMessageView[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [canSend, setCanSend] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const onInboxChangeRef = useRef(onInboxChange);
  const onPeerReadRef = useRef(onPeerRead);
  const acknowledgeInFlightRef = useRef(false);
  onInboxChangeRef.current = onInboxChange;
  onPeerReadRef.current = onPeerRead;

  const applyReceipts = useCallback((receipts: Parameters<typeof applyMessageReceipts>[1]) => {
    setMessages((prev) => applyMessageReceipts(prev, receipts));
  }, []);

  const mergeMessages = useCallback((incoming: DirectMessageView[]) => {
    setMessages((prev) => {
      const byId = new Map(prev.map((m) => [m.id, m]));
      for (const m of incoming) byId.set(m.id, m);
      return [...byId.values()].sort((a, b) => a.id - b.id);
    });
  }, []);

  const acknowledgeIncoming = useCallback(async () => {
    if (!enabled || acknowledgeInFlightRef.current) return;
    acknowledgeInFlightRef.current = true;
    try {
      await markMessagesRead(accessToken, peer.userId);
      onPeerReadRef.current?.(peer.userId);
      onInboxChangeRef.current?.();
    } catch {
      /* ignore */
    } finally {
      acknowledgeInFlightRef.current = false;
    }
  }, [accessToken, peer.userId, enabled]);

  const acknowledgeIncomingRef = useRef(acknowledgeIncoming);
  acknowledgeIncomingRef.current = acknowledgeIncoming;

  const handlePolledMessages = useCallback(
    (incoming: DirectMessageView[]) => {
      const hasIncoming = incoming.some((m) => m.senderId === peer.userId);
      mergeMessages(incoming);
      if (hasIncoming) {
        void acknowledgeIncomingRef.current();
      }
    },
    [mergeMessages, peer.userId],
  );

  const { seedLastMessageId } = useMessagePolling({
    accessToken,
    peerUserId: peer.userId,
    enabled,
    onNewMessages: handlePolledMessages,
    onReceiptsUpdate: applyReceipts,
  });

  useEffect(() => {
    let cancelled = false;
    setCanSend(true);
    setSendError(null);
    void fetchUserRelation(accessToken, peer.userId)
      .then((rel) => {
        if (!cancelled) setCanSend(rel.canMessage);
      })
      .catch(() => {
        if (!cancelled) setCanSend(false);
      });
    return () => {
      cancelled = true;
    };
  }, [accessToken, peer.userId]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    setMessages([]);
    void (async () => {
      try {
        const history = await fetchMessagesWith(accessToken, peer.userId);
        if (cancelled) return;
        const receipts = await loadReceiptsSafe(accessToken, peer.userId);
        if (cancelled) return;
        setMessages(history);
        applyReceipts(receipts);
        const last = history[history.length - 1];
        if (last) seedLastMessageId(last.id);
        await acknowledgeIncomingRef.current();
      } catch (e) {
        if (!cancelled) setLoadError(formatApiError(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [accessToken, peer.userId, applyReceipts, seedLastMessageId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages.length]);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    if (!body || !canSend) return;
    setSending(true);
    setSendError(null);
    try {
      const sent = await sendDirectMessage(accessToken, peer.userId, body);
      setDraft('');
      mergeMessages([sent]);
      seedLastMessageId(sent.id);
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr.code === 'MESSAGE_NOT_ALLOWED') {
        setCanSend(false);
      }
      setSendError(formatApiError(err));
    } finally {
      setSending(false);
    }
  }

  const sendBlockedHint =
    'Писать можно только друзьям или коллегам из одного workspace. Историю переписки можно просматривать.';

  return (
    <div className="trello-social-conversation">
      <header className="trello-social-conversation-head">
        <strong>{displayName(peer)}</strong>
      </header>
      {loadError && <div className="trello-banner trello-banner-error">{loadError}</div>}
      {sendError && <div className="trello-banner trello-banner-error">{sendError}</div>}
      <div ref={scrollRef} className="trello-social-messages-scroll">
        {loading ? (
          <p className="trello-muted">Загрузка переписки…</p>
        ) : messages.length === 0 ? (
          <p className="trello-muted">
            {canSend ? 'Напишите первое сообщение.' : sendBlockedHint}
          </p>
        ) : (
          <ul className="trello-social-messages-list">
            {messages.map((m) => {
              const mine = m.senderId === currentUserId;
              return (
                <li
                  key={m.id}
                  className={
                    mine
                      ? 'trello-social-message trello-social-message--mine'
                      : 'trello-social-message trello-social-message--theirs'
                  }
                >
                  <span className="trello-social-message-body">{m.body}</span>
                  {mine && <MessageReadTicks read={m.readAt != null} />}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {canSend ? (
        <form className="trello-social-compose" onSubmit={(e) => void handleSend(e)}>
          <input
            className="trello-input"
            placeholder="Сообщение…"
            value={draft}
            maxLength={2000}
            disabled={sending}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button
            type="submit"
            className="trello-btn trello-btn-primary trello-btn-sm"
            disabled={sending || !draft.trim()}
          >
            Отправить
          </button>
        </form>
      ) : (
        <p className="trello-muted trello-social-compose-hint">{sendBlockedHint}</p>
      )}
    </div>
  );
}
