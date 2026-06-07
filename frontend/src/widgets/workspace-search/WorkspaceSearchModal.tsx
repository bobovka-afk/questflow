import { useCallback, useEffect, useState } from 'react';
import { api } from '@shared/api';
import { navigate } from '@shared/lib/navigation-core';

type SearchHit = {
  cardId: number;
  title: string;
  boardId: number;
  boardName: string;
  listId: number;
  listName: string;
  assigneeId: number | null;
  dueDate: string | null;
  snippet: string | null;
};

type Props = {
  accessToken: string;
  workspaceId: number;
  open: boolean;
  onClose: () => void;
};

export function WorkspaceSearchModal({ accessToken, workspaceId, open, onClose }: Props) {
  const [q, setQ] = useState('');
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);

  const runSearch = useCallback(async () => {
    const query = q.trim();
    if (query.length < 2) {
      setHits([]);
      return;
    }
    setLoading(true);
    try {
      const data = await api<SearchHit[]>(
        `/workspace/${workspaceId}/search?q=${encodeURIComponent(query)}`,
        { method: 'GET', accessToken },
      );
      setHits(Array.isArray(data) ? data : []);
    } catch {
      setHits([]);
    } finally {
      setLoading(false);
    }
  }, [accessToken, workspaceId, q]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => void runSearch(), 300);
    return () => window.clearTimeout(t);
  }, [open, runSearch]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setQ('');
  }, [open]);

  if (!open) return null;

  return (
    <div className="trello-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="trello-modal trello-search-modal"
        role="dialog"
        aria-modal
        aria-label="Поиск по рабочему пространству"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="trello-modal-head">
          <h2 className="trello-modal-title">Поиск</h2>
          <button type="button" className="trello-modal-close" onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </div>
        <div className="trello-modal-body">
          <input
            className="trello-input trello-search-modal-input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoFocus
          />
          {loading && <p className="trello-settings-card-hint">Поиск…</p>}
          {!loading && q.trim().length >= 2 && hits.length === 0 && (
            <p className="trello-settings-card-hint">Ничего не найдено.</p>
          )}
          <ul className="trello-search-hits">
            {hits.map((h) => (
              <li key={h.cardId}>
                <button
                  type="button"
                  className="trello-search-hit"
                  onClick={() => {
                    onClose();
                    navigate(`/workspaces/${workspaceId}/boards/${h.boardId}`);
                  }}
                >
                  <span className="trello-search-hit-title">{h.title}</span>
                  <span className="trello-search-hit-meta">
                    {h.boardName} · {h.listName}
                  </span>
                  {h.snippet ? (
                    <span className="trello-search-hit-snippet">{h.snippet}</span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
