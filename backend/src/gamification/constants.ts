import { XpEventType } from '../generated/prisma/enums';

export const DEFAULT_GAME_DAY_TZ = 'UTC';

export const XP_EVENT_TYPES_REQUIRING_DAY_KEY: readonly XpEventType[] = [
  XpEventType.DAILY_CHECKIN,
  XpEventType.CHECKIN_STREAK,
  XpEventType.PERSONAL_DAILY_COMPLETED,
  XpEventType.HABIT_POSITIVE,
] as const;
