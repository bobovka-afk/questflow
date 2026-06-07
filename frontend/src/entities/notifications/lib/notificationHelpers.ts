export type NotificationRow = {
  id: number;
  type: string;
  payload: Record<string, unknown>;
  readAt: string | null;
  createdAt: string;
};

export function notificationSummary(row: NotificationRow): string {
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
