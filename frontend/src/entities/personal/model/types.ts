export type HabitPolarity = 'POSITIVE' | 'NEGATIVE' | 'BOTH';

export type PersonalHabitDto = {
  id: number;
  title: string;
  polarity: HabitPolarity;
  emoji: string | null;
  color: string | null;
  sortOrder: number;
  streakCurrent: number;
  streakBest: number;
  positiveCount: number;
  negativeCount: number;
};

export type PersonalDailyDto = {
  id: number;
  title: string;
  sortOrder: number;
  streakCurrent: number;
  streakBest: number;
  lastCompletedDayKey: string | null;
  completedToday?: boolean;
};

export type PersonalTodoDto = {
  id: number;
  title: string;
  notes: string | null;
  dueAt: string | null;
  isCompleted: boolean;
  sortOrder: number;
  completedAt?: string | null;
};

export type PersonalBoardDto = {
  dayKey: string;
  stats: {
    activityXpToday: number;
    activityXpMax: number;
  };
  habits: PersonalHabitDto[];
  dailies: PersonalDailyDto[];
  todos: PersonalTodoDto[];
};

export type PersonalActionResponse = {
  ok: true;
  rewards?: import('@entities/reward').XpGrantRewards;
  xpGranted?: boolean;
};

export type CompletedPersonalTodosPageDto = {
  items: PersonalTodoDto[];
  total: number;
  limit: number;
  offset: number;
};
