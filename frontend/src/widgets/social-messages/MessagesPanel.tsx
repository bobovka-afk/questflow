import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatApiError } from '@shared/api';
import {
  fetchConversations,
  fetchUserRelation,
  type ConversationPreview,
  type SocialUserSummary,
} from '@entities/social';
import { ConversationView } from './ConversationView';

type Props = {
  accessToken: string;
  currentUserId: number;
  initialPeerUserId?: number | null;
  initialPeer?: SocialUserSummary | null;
  visible: boolean;
  onInboxChange?: () => void;
};

function displayName(user: SocialUserSummary): string {
  return user.characterName?.trim() || user.name;
}

export function MessagesPanel({
  accessToken,
  currentUserId,
  initialPeerUserId,
  initialPeer,
  visible,
  onInboxChange,
}: Props) {
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [selectedPeerId, setSelectedPeerId] = useState<number | null>(
    initialPeerUserId ?? null,
  );
  const [peerProfiles, setPeerProfiles] = useState<Record<number, SocialUserSummary>>({});
  const [loadingPeerProfile, setLoadingPeerProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearUnreadForPeer = useCallback((peerUserId: number) => {
    setConversations((prev) =>
      prev.map((c) => (c.peerUserId === peerUserId ? { ...c, unreadCount: 0 } : c)),
    );
  }, []);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchConversations(accessToken);
      setConversations(list);
    } catch (e) {
      setError(formatApiError(e));
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const handlePeerRead = useCallback(
    (peerUserId: number) => {
      clearUnreadForPeer(peerUserId);
      onInboxChange?.();
    },
    [clearUnreadForPeer, onInboxChange],
  );

  useEffect(() => {
    if (!visible) return;
    void reload();
  }, [visible, reload]);

  useEffect(() => {
    if (initialPeerUserId != null) {
      setSelectedPeerId(initialPeerUserId);
    }
  }, [initialPeerUserId]);

  useEffect(() => {
    if (initialPeer) {
      setPeerProfiles((prev) => ({ ...prev, [initialPeer.userId]: initialPeer }));
    }
  }, [initialPeer]);

  useEffect(() => {
    if (selectedPeerId == null || !visible) return;
    if (conversations.some((c) => c.peerUserId === selectedPeerId)) return;
    if (peerProfiles[selectedPeerId]) return;

    let cancelled = false;
    setLoadingPeerProfile(true);
    void fetchUserRelation(accessToken, selectedPeerId)
      .then((rel) => {
        if (!cancelled) {
          setPeerProfiles((prev) => ({ ...prev, [selectedPeerId]: rel.user }));
        }
      })
      .catch(() => {
        /* keep pane empty until reload */
      })
      .finally(() => {
        if (!cancelled) setLoadingPeerProfile(false);
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken, conversations, peerProfiles, selectedPeerId, visible]);

  const selectedPeer: SocialUserSummary | null = useMemo(() => {
    if (selectedPeerId == null) return null;
    return (
      conversations.find((c) => c.peerUserId === selectedPeerId)?.peer ??
      peerProfiles[selectedPeerId] ??
      null
    );
  }, [conversations, peerProfiles, selectedPeerId]);

  return (
    <div className="trello-social-messages-layout trello-social-messages-layout--cards">
      <aside className="trello-social-conversations trello-social-messages-panel">
        <h3 className="trello-social-section-title">Диалоги</h3>
        {error && <div className="trello-banner trello-banner-error">{error}</div>}
        {loading ? (
          <p className="trello-muted">Загрузка…</p>
        ) : conversations.length === 0 ? (
          <p className="trello-muted">Пока нет переписок.</p>
        ) : (
          <ul className="trello-social-conv-list">
            {conversations.map((c) => (
              <li key={c.peerUserId}>
                <button
                  type="button"
                  className={
                    selectedPeerId === c.peerUserId
                      ? 'trello-social-conv-btn trello-social-conv-btn--active'
                      : 'trello-social-conv-btn'
                  }
                  onClick={() => {
                    setSelectedPeerId(c.peerUserId);
                    if (c.unreadCount > 0) clearUnreadForPeer(c.peerUserId);
                  }}
                >
                  <span className="trello-social-conv-name">{displayName(c.peer)}</span>
                  {c.lastMessage && (
                    <span className="trello-social-conv-preview">
                      {c.lastMessage.body}
                    </span>
                  )}
                  {c.unreadCount > 0 && (
                    <span className="trello-social-unread-badge">{c.unreadCount}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>
      <div className="trello-social-conversation-pane trello-social-messages-panel">
        {selectedPeerId != null && loadingPeerProfile && !selectedPeer ? (
          <p className="trello-muted">Загрузка диалога…</p>
        ) : selectedPeer && selectedPeerId != null ? (
          <ConversationView
            accessToken={accessToken}
            currentUserId={currentUserId}
            peer={selectedPeer}
            enabled={visible && selectedPeerId != null}
            onInboxChange={onInboxChange}
            onPeerRead={handlePeerRead}
          />
        ) : (
          <p className="trello-muted trello-social-select-hint">
            Выберите диалог или напишите другу из списка друзей.
          </p>
        )}
      </div>
    </div>
  );
}
