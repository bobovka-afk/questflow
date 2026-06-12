import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import { api } from '@shared/api';
import { formatDateTimeRu } from '@shared/lib/formatDateRu';
import { navigate } from '@shared/lib/navigation-core';
import {
  countUnreadNotifications,
  matchesNotificationFilter,
  NOTIFICATION_FILTER_OPTIONS,
  notificationDisplay,
  notificationTypeBadge,
  navigateForNotification,
  type NotificationFilterId,
  type NotificationRow,
} from '@entities/notifications/lib/notificationHelpers';

type Props = {
  accessToken: string;
};

const NOTIFICATIONS_PER_PAGE = 16;
const NOTIFICATIONS_GRID_COLUMNS = 4;
const NOTIFICATIONS_GRID_ROWS = 4;

function getNotificationTotalPages(itemCount: number): number {
  return Math.max(1, Math.ceil(itemCount / NOTIFICATIONS_PER_PAGE));
}

function sliceNotificationPage<T>(items: T[], page: number): T[] {
  const totalPages = getNotificationTotalPages(items.length);
  const safePage = Math.min(Math.max(0, page), totalPages - 1);
  const start = safePage * NOTIFICATIONS_PER_PAGE;
  return items.slice(start, start + NOTIFICATIONS_PER_PAGE);
}

function NotificationListItem(props: {
  row: NotificationRow;
  accessToken: string;
  onNavigate: () => void;
}) {
  const { row } = props;
  const display = notificationDisplay(row);

  return (
    <li>
      <button
        type="button"
        className={`px-notification-item px-notification-item--tile${row.readAt ? '' : ' px-notification-item--unread'}`}
        onClick={() => void navigateForNotification(row, props.accessToken, navigate).then(props.onNavigate)}
      >
        <span className="px-notification-tile-badge" aria-hidden>
          {notificationTypeBadge(row.type)}
        </span>
        <span className="px-notification-tile-action">{display.action}</span>
        {display.reason ? (
          <span className="px-notification-tile-reason">{display.reason}</span>
        ) : null}
        <time className="px-notification-tile-time" dateTime={row.createdAt}>
          {formatDateTimeRu(row.createdAt)}
        </time>
      </button>
    </li>
  );
}

export function NotificationsPage({ accessToken }: Props) {
  const [rows, setRows] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState<NotificationFilterId>('all');
  const [page, setPage] = useState(0);

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

  useEffect(() => {
    setPage(0);
  }, [filter]);

  const filteredRows = useMemo(
    () => rows.filter((row) => matchesNotificationFilter(row, filter)),
    [rows, filter],
  );

  const totalPages = getNotificationTotalPages(filteredRows.length);
  const safePage = Math.min(Math.max(0, page), totalPages - 1);
  const pageRows = useMemo(
    () => sliceNotificationPage(filteredRows, safePage),
    [filteredRows, safePage],
  );

  useEffect(() => {
    if (page !== safePage) {
      setPage(safePage);
    }
  }, [page, safePage]);

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
    <div className="px-page px-notifications-page">
      <header className="px-topbar">
        <div className="px-topbar-left">
          <h1 className="px-topbar-title">Уведомления</h1>
        </div>
      </header>

      {!loading && rows.length > 0 ? (
        <div className="px-notifications-toolbar">
          <div className="px-notifications-filters" role="tablist" aria-label="Фильтр уведомлений">
            {NOTIFICATION_FILTER_OPTIONS.map((option) => {
              const unreadCount = countUnreadNotifications(rows, option.id);
              const active = filter === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`px-notifications-filter-chip${active ? ' px-notifications-filter-chip--active' : ''}`}
                  onClick={() => setFilter(option.id)}
                >
                  {option.label}
                  {unreadCount > 0 ? (
                    <span className="px-notifications-filter-count">{unreadCount}</span>
                  ) : null}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            className="px-btn px-btn--ghost px-notifications-mark-all"
            disabled={busy || rows.every((r) => r.readAt)}
            onClick={() => void markAllRead()}
          >
            Прочитать все
          </button>
        </div>
      ) : null}

      <div className="px-content px-notifications-content">
        {loading ? (
          <p className="px-empty px-notifications-empty">Загрузка…</p>
        ) : rows.length === 0 ? (
          <p className="px-empty px-notifications-empty">Пока нет уведомлений.</p>
        ) : filteredRows.length === 0 ? (
          <p className="px-empty px-notifications-empty">В этой категории пока нет уведомлений.</p>
        ) : (
          <div className="px-notifications-panel">
            <div className="px-notifications-page-grid">
              <ul
                className="px-notifications-list px-notifications-list--paged"
                style={
                  {
                    '--px-notifications-grid-cols': NOTIFICATIONS_GRID_COLUMNS,
                    '--px-notifications-grid-rows': NOTIFICATIONS_GRID_ROWS,
                  } as CSSProperties
                }
              >
                {pageRows.map((row) => (
                  <NotificationListItem
                    key={row.id}
                    row={row}
                    accessToken={accessToken}
                    onNavigate={() => void loadList()}
                  />
                ))}
              </ul>
              <nav className="trello-character-storage-pager px-notifications-pager" aria-label="Страницы уведомлений">
                <button
                  type="button"
                  className="trello-character-storage-pager-btn"
                  disabled={safePage <= 0}
                  onClick={() => setPage(safePage - 1)}
                  aria-label="Предыдущая страница"
                >
                  ←
                </button>
                <span className="trello-character-storage-pager-label">
                  {safePage + 1} / {totalPages}
                </span>
                <button
                  type="button"
                  className="trello-character-storage-pager-btn"
                  disabled={safePage >= totalPages - 1}
                  onClick={() => setPage(safePage + 1)}
                  aria-label="Следующая страница"
                >
                  →
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
