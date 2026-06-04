import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@shared/api';
import { navigate } from '@shared/lib/navigation-core';

type NotificationRow = {
  id: number;
  type: string;
  payload: Record<string, unknown>;
  readAt: string | null;
  createdAt: string;
};

type Props = {
  accessToken: string;
};

function summary(row: NotificationRow): string {
  const p = row.payload;
  if (row.type === 'MENTION') {
    return `${String(p.authorName ?? 'Кто-то')} упомянул(а) вас в «${String(p.cardTitle ?? 'карточка')}»`;
  }
  if (row.type === 'DEADLINE') {
    return `Скоро дедлайн: «${String(p.cardTitle ?? 'карточка')}»`;
  }
  if (row.type === 'QUEST_COMPLETED') {
    return `Квест выполнен: ${String(p.questTitle ?? 'квест')}`;
  }
  if (row.type === 'CHEST_READY') {
    return `Сундук готов: ${String(p.questTitle ?? 'награда')}`;
  }
  if (row.type === 'ACHIEVEMENT') {
    return `Достижение: ${String(p.titleRu ?? p.achievementKey ?? '')}`;
  }
  if (row.type === 'PARTY_RAID_INVITE') {
    return `Приглашение в рейд: ${String(p.bossNameRu ?? p.bossName ?? 'босс')}`;
  }
  if (row.type === 'FRIEND_REQUEST') {
    return `Заявка в друзья от ${String(p.requesterName ?? p.fromName ?? 'пользователя')}`;
  }
  if (row.type === 'CARD_ASSIGNED') {
    return `Вас назначили на «${String(p.title ?? p.cardTitle ?? 'карточку')}»`;
  }
  return 'Уведомление';
}

export function NotificationBell({ accessToken }: Props) {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [rows, setRows] = useState<NotificationRow[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const refreshCount = useCallback(async () => {
    try {
      const data = await api<{ count: number }>('/notifications/unread-count', {
        method: 'GET',
        accessToken,
      });
      setCount(data.count ?? 0);
    } catch {
      setCount(0);
    }
  }, [accessToken]);

  const loadList = useCallback(async () => {
    try {
      const data = await api<NotificationRow[]>(
        '/notifications?limit=30&offset=0',
        { method: 'GET', accessToken },
      );
      setRows(Array.isArray(data) ? data : []);
    } catch {
      setRows([]);
    }
  }, [accessToken]);

  useEffect(() => {
    void refreshCount();
    const id = window.setInterval(() => void refreshCount(), 60_000);
    return () => window.clearInterval(id);
  }, [refreshCount]);

  useEffect(() => {
    if (!open) return;
    void loadList();
  }, [open, loadList]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  async function openNotification(row: NotificationRow) {
    const p = row.payload;
    await api(`/notifications/${row.id}/read`, {
      method: 'PATCH',
      accessToken,
    });
    setOpen(false);
    void refreshCount();

    if (row.type === 'PARTY_RAID_INVITE' && typeof p.raidId === 'number') {
      navigate(`/profile/character?partyRaid=${p.raidId}`);
      return;
    }
    if (row.type === 'FRIEND_REQUEST') {
      navigate('/profile/character');
      return;
    }
    if (
      row.type === 'QUEST_COMPLETED' ||
      row.type === 'CHEST_READY' ||
      row.type === 'ACHIEVEMENT'
    ) {
      navigate('/profile/character');
      return;
    }

    const ws = p.workspaceId;
    const board = p.boardId;
    if (typeof ws === 'number' && typeof board === 'number') {
      navigate(`/workspaces/${ws}/boards/${board}`);
    }
  }

  return (
    <div className="trello-notification-bell" ref={ref}>
      <button
        type="button"
        className="trello-btn trello-btn-ghost trello-notification-bell-btn"
        aria-label={`Уведомления${count > 0 ? `, непрочитанных: ${count}` : ''}`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <svg
          className="trello-notification-bell-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {count > 0 ? (
          <span className="trello-notification-bell-badge">{count > 99 ? '99+' : count}</span>
        ) : null}
      </button>
      {open && (
        <div className="trello-notification-panel" role="menu">
          <div className="trello-notification-panel-head">
            <span>Уведомления</span>
            <button
              type="button"
              className="trello-btn trello-btn-ghost trello-btn-sm"
              onClick={async () => {
                await api('/notifications/read-all', { method: 'PATCH', accessToken });
                void refreshCount();
                void loadList();
              }}
            >
              Прочитать все
            </button>
          </div>
          {rows.length === 0 ? (
            <p className="trello-settings-card-hint">Пока пусто.</p>
          ) : (
            <ul className="trello-notification-list">
              {rows.map((row) => (
                <li key={row.id}>
                  <button
                    type="button"
                    className={`trello-notification-item${row.readAt ? '' : ' trello-notification-item--unread'}`}
                    onClick={() => void openNotification(row)}
                  >
                    {summary(row)}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
