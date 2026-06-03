export type WorkspaceLabelRow = {
  id: number;
  name: string;
  colorPreset: string;
};

export type CardWithLabels = {
  assigneeId: number | null;
  dueDate: string | null;
  isCompleted?: boolean;
  labels?: WorkspaceLabelRow[];
};

export type BoardCardFilter = 'all' | 'mine' | 'overdue' | 'unassigned';

export function filterBoardCards<T extends CardWithLabels>(
  cards: T[],
  filter: BoardCardFilter,
  labelId: number | null,
  currentUserId: number | null,
): T[] {
  const now = Date.now();
  return cards.filter((c) => {
    if (filter === 'mine' && currentUserId != null) {
      if (c.assigneeId !== currentUserId) return false;
    }
    if (filter === 'unassigned' && c.assigneeId != null) return false;
    if (filter === 'overdue') {
      if (!c.dueDate || c.isCompleted) return false;
      if (new Date(c.dueDate).getTime() >= now) return false;
    }
    if (labelId != null) {
      if (!(c.labels ?? []).some((l) => l.id === labelId)) return false;
    }
    return true;
  });
}

export const CARD_REMINDER_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'Без напоминания' },
  { value: '15', label: 'За 15 минут' },
  { value: '60', label: 'За 1 час' },
  { value: '1440', label: 'За 1 день' },
  { value: '10080', label: 'За 1 неделю' },
];

export function formatMentionToken(userId: number): string {
  return `@[user:${userId}]`;
}
