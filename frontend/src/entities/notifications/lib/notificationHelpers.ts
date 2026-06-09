export type NotificationRow = {
  id: number;
  type: string;
  payload: Record<string, unknown>;
  readAt: string | null;
  createdAt: string;
};

export type NotificationCategory = 'tasks' | 'rpg' | 'social';

export type NotificationFilterId = 'all' | 'unread' | NotificationCategory;

export const NOTIFICATION_FILTER_OPTIONS: ReadonlyArray<{
  id: NotificationFilterId;
  label: string;
}> = [
  { id: 'all', label: 'Все' },
  { id: 'unread', label: 'Непрочитанные' },
  { id: 'tasks', label: 'Задачи' },
  { id: 'rpg', label: 'RPG' },
  { id: 'social', label: 'Социальное' },
] as const;

export function notificationCategory(type: string): NotificationCategory | null {
  switch (type) {
    case 'MENTION':
    case 'DEADLINE':
    case 'CARD_ASSIGNED':
      return 'tasks';
    case 'QUEST_COMPLETED':
    case 'CHEST_READY':
    case 'ACHIEVEMENT':
    case 'XP_GAIN':
      return 'rpg';
    case 'FRIEND_REQUEST':
    case 'PARTY_RAID_INVITE':
      return 'social';
    default:
      return null;
  }
}

export function matchesNotificationFilter(
  row: NotificationRow,
  filter: NotificationFilterId,
): boolean {
  if (filter === 'all') return true;
  if (filter === 'unread') return !row.readAt;
  return notificationCategory(row.type) === filter;
}

export function notificationTypeBadge(type: string): string {
  switch (type) {
    case 'MENTION':
      return '@';
    case 'DEADLINE':
      return '⏰';
    case 'CARD_ASSIGNED':
      return '✓';
    case 'QUEST_COMPLETED':
      return '📜';
    case 'CHEST_READY':
      return '📦';
    case 'ACHIEVEMENT':
      return '🏆';
    case 'PARTY_RAID_INVITE':
      return '🐉';
    case 'FRIEND_REQUEST':
      return '👤';
    case 'XP_GAIN':
      return '⭐';
    default:
      return '•';
  }
}

export function countUnreadNotifications(
  rows: NotificationRow[],
  filter: NotificationFilterId,
): number {
  return rows.filter((row) => !row.readAt && matchesNotificationFilter(row, filter)).length;
}

export type NotificationDisplay = {
  action: string;
  reason: string;
};

function xpSourceLabel(source: unknown): string {
  switch (source) {
    case 'TASK_COMPLETED':
      return 'За выполненную задачу';
    case 'DAILY_CHECKIN':
      return 'За ежедневный чекин';
    case 'CHECKIN_STREAK':
      return 'За серию чекинов';
    default:
      return 'За активность в Questflow';
  }
}

export function notificationDisplay(row: NotificationRow): NotificationDisplay {
  const p = row.payload;
  switch (row.type) {
    case 'MENTION':
      return {
        action: 'Упоминание',
        reason: `${String(p.authorName ?? 'Кто-то')} · «${String(p.cardTitle ?? 'карточка')}»`,
      };
    case 'DEADLINE':
      return {
        action: 'Скоро дедлайн',
        reason: `«${String(p.cardTitle ?? 'карточка')}»`,
      };
    case 'QUEST_COMPLETED':
      return {
        action: 'Квест выполнен',
        reason: String(p.questTitle ?? 'квест'),
      };
    case 'CHEST_READY':
      return {
        action: 'Сундук получен',
        reason: `За «${String(p.questTitle ?? 'квест')}»`,
      };
    case 'ACHIEVEMENT':
      return {
        action: 'Достижение получено',
        reason: String(p.titleRu ?? p.key ?? p.achievementKey ?? 'награда'),
      };
    case 'XP_GAIN':
      return {
        action: 'Получен опыт',
        reason: `${String(p.xpAmount ?? '?')} XP · ${xpSourceLabel(p.source)}`,
      };
    case 'PARTY_RAID_INVITE':
      return {
        action: 'Приглашение в рейд',
        reason: String(p.bossNameRu ?? p.bossName ?? 'босс'),
      };
    case 'FRIEND_REQUEST':
      return {
        action: 'Заявка в друзья',
        reason: String(p.requesterName ?? p.fromName ?? 'пользователь'),
      };
    case 'CARD_ASSIGNED':
      return {
        action: 'Назначение на карточку',
        reason: `«${String(p.title ?? p.cardTitle ?? 'карточка')}»`,
      };
    default:
      return { action: 'Уведомление', reason: '' };
  }
}

export function notificationSummary(row: NotificationRow): string {
  const { action, reason } = notificationDisplay(row);
  return reason ? `${action}: ${reason}` : action;
}

export async function navigateForNotification(
  row: NotificationRow,
  accessToken: string,
  navigate: (path: string) => void,
) {
  const { api } = await import('@shared/api');
  const p = row.payload;
  await api(`/notifications/${row.id}/read`, {
    method: 'PATCH',
    accessToken,
  });

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
