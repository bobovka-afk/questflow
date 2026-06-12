import { XpEventType } from '../../generated/prisma/enums';

export const TASK_LIKE_XP_EVENT_TYPES: readonly XpEventType[] = [
  XpEventType.TASK_COMPLETED,
  XpEventType.PERSONAL_TODO_COMPLETED,
  XpEventType.PERSONAL_DAILY_COMPLETED,
] as const;

export function isTaskLikeXpEvent(type: XpEventType): boolean {
  return TASK_LIKE_XP_EVENT_TYPES.includes(type);
}

export function isDailyActivityXpEvent(type: XpEventType): boolean {
  return (
    isTaskLikeXpEvent(type) || type === XpEventType.HABIT_POSITIVE
  );
}
