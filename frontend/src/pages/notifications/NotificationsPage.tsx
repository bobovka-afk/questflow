import { useCallback, useEffect, useState } from 'react';
import { api } from '@shared/api';
import { navigate } from '@shared/lib/navigation-core';
import {
  notificationSummary,
  navigateForNotification,
  type NotificationRow,
} from '@entities/notifications/lib/notificationHelpers';

type Props = {
  accessToken: string;
};

export function NotificationsPage({ accessToken }: Props) {
  const [rows, setRows] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const loadList = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api<NotificationRow[]>('/notifications?limit=50&offset=0', {
        method: 'GET',
        accessToken,
      });
      setRows(Array.isArray(data) ? data : []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  async function markAllRead() {
    setBusy(true);
    try {
      await api('/notifications/read-all', { method: 'PATCH', accessToken });
      await loadList();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="px-page">
      <header className="px-topbar">
        <div className="px-topbar-left">
          <h1 className="px-topbar-title">Уведомления</h1>
        </div>
        <div className="px-topbar-actions">
          <button
            type="button"
            className="px-btn px-btn--ghost"
            disabled={busy || rows.every((r) => r.readAt)}
            onClick={() => void markAllRead()}
          >
            Прочитать все
          </button>
        </div>
      </header>

      <div className="px-content">
        {loading ? (
          <p className="px-empty">Загрузка…</p>
        ) : rows.length === 0 ? (
          <p className="px-empty">Пока нет уведомлений.</p>
        ) : (
          <ul className="px-notifications-list">
            {rows.map((row) => (
              <li key={row.id}>
                <button
                  type="button"
                  className={`px-notification-item${row.readAt ? '' : ' px-notification-item--unread'}`}
                  onClick={() => void navigateForNotification(row, accessToken, navigate)}
                >
                  <span className="px-notification-text">{notificationSummary(row)}</span>
                  <time className="px-notification-time" dateTime={row.createdAt}>
                    {new Date(row.createdAt).toLocaleString('ru-RU', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </time>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
