import type { XpEventType } from '../../../generated/prisma/enums';

export interface XpGrantEventInput {
  type: XpEventType;
  xpAmount: number;
  cardId: number | null;
  dayKey: Date | null;
  personalTodoId?: number | null;
  personalDailyId?: number | null;
  personalHabitId?: number | null;
}
