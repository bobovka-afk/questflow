import { useCallback, useEffect, useRef, useState } from 'react';
import {
  completePersonalDaily,
  completePersonalTodo,
  createPersonalDaily,
  createPersonalHabit,
  createPersonalTodo,
  fetchPersonalBoard,
  logPersonalHabit,
  archivePersonalDaily,
  archivePersonalHabit,
  archivePersonalTodo,
  uncompletePersonalTodo,
  updatePersonalDaily,
  updatePersonalHabit,
  updatePersonalTodo,
} from '@entities/personal/api/personalApi';
import type { HabitPolarity, PersonalBoardDto } from '@entities/personal/model/types';
import type { XpGrantRewards } from '@entities/reward';

type Props = {
  accessToken: string | null;
};

function yesterdayDayKey(dayKey: string): string {
  const d = new Date(`${dayKey}T12:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function usePersonalBoard({ accessToken }: Props) {
  const [board, setBoard] = useState<PersonalBoardDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const completingDailyIdsRef = useRef(new Set<number>());
  const completingTodoIdsRef = useRef(new Set<number>());

  const reload = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!accessToken) {
        setBoard(null);
        setLoading(false);
        return;
      }
      const silent = options?.silent ?? false;
      if (!silent) {
        setLoading(true);
      }
      setError(null);
      try {
        const data = await fetchPersonalBoard(accessToken);
        setBoard(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Не удалось загрузить раздел');
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [accessToken],
  );

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    board,
    loading,
    error,
    busy,
    reload,
    async addHabit(title: string, polarity: HabitPolarity = 'POSITIVE') {
      if (!accessToken) return;
      setBusy(true);
      setError(null);
      try {
        const habit = await createPersonalHabit(accessToken, { title, polarity });
        setBoard((prev) =>
          prev ? { ...prev, habits: [...prev.habits, habit] } : prev,
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Не удалось добавить привычку');
        throw e;
      } finally {
        setBusy(false);
      }
    },
    async addDaily(title: string) {
      if (!accessToken) return;
      setBusy(true);
      setError(null);
      try {
        const daily = await createPersonalDaily(accessToken, { title });
        setBoard((prev) =>
          prev
            ? {
                ...prev,
                dailies: [...prev.dailies, { ...daily, completedToday: false }],
              }
            : prev,
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Не удалось добавить ежедневную задачу');
        throw e;
      } finally {
        setBusy(false);
      }
    },
    async addTodo(title: string) {
      if (!accessToken) return;
      setBusy(true);
      setError(null);
      try {
        const todo = await createPersonalTodo(accessToken, { title });
        setBoard((prev) =>
          prev ? { ...prev, todos: [...prev.todos, todo] } : prev,
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Не удалось добавить задачу');
        throw e;
      } finally {
        setBusy(false);
      }
    },
    logHabit(
      habitId: number,
      direction: 'positive' | 'negative',
      onRewards?: (rewards: XpGrantRewards) => void,
    ): void {
      if (!accessToken || !board) return;

      const previousBoard = board;

      setBoard((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          habits: prev.habits.map((h) => {
            if (h.id !== habitId) return h;
            if (direction === 'positive') {
              const streakCurrent = h.streakCurrent + 1;
              return {
                ...h,
                positiveCount: h.positiveCount + 1,
                streakCurrent,
                streakBest: Math.max(h.streakBest, streakCurrent),
              };
            }
            return {
              ...h,
              negativeCount: h.negativeCount + 1,
              streakCurrent: 0,
            };
          }),
        };
      });

      void logPersonalHabit(accessToken, habitId, direction)
        .then((result) => {
          if (result.rewards) onRewards?.(result.rewards);
        })
        .catch((e) => {
          setBoard(previousBoard);
          setError(e instanceof Error ? e.message : 'Не удалось отметить привычку');
        });
    },
    completeDaily(
      dailyId: number,
      onRewards?: (rewards: XpGrantRewards) => void,
    ): void {
      if (!accessToken || !board) return;
      if (completingDailyIdsRef.current.has(dailyId)) return;
      if (board.dailies.some((d) => d.id === dailyId && d.completedToday)) return;

      completingDailyIdsRef.current.add(dailyId);
      const previousBoard = board;
      const yesterdayStr = yesterdayDayKey(board.dayKey);

      setBoard((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          dailies: prev.dailies.map((d) => {
            if (d.id !== dailyId || d.completedToday) return d;
            const lastStr = d.lastCompletedDayKey?.slice(0, 10) ?? null;
            const streakCurrent = lastStr === yesterdayStr ? d.streakCurrent + 1 : 1;
            return {
              ...d,
              completedToday: true,
              lastCompletedDayKey: prev.dayKey,
              streakCurrent,
              streakBest: Math.max(d.streakBest, streakCurrent),
            };
          }),
        };
      });

      void completePersonalDaily(accessToken, dailyId)
        .then((result) => {
          if (result.rewards) onRewards?.(result.rewards);
        })
        .catch((e) => {
          setBoard(previousBoard);
          setError(e instanceof Error ? e.message : 'Не удалось выполнить ежедневную задачу');
        })
        .finally(() => {
          completingDailyIdsRef.current.delete(dailyId);
        });
    },
    completeTodo(
      todoId: number,
      onRewards?: (rewards: XpGrantRewards) => void,
    ): void {
      if (!accessToken || !board) return;
      if (completingTodoIdsRef.current.has(todoId)) return;
      if (!board.todos.some((t) => t.id === todoId)) return;

      completingTodoIdsRef.current.add(todoId);
      const previousBoard = board;
      setBoard((prev) =>
        prev ? { ...prev, todos: prev.todos.filter((t) => t.id !== todoId) } : prev,
      );

      void completePersonalTodo(accessToken, todoId)
        .then((result) => {
          if (result.rewards) onRewards?.(result.rewards);
        })
        .catch((e) => {
          setBoard(previousBoard);
          setError(e instanceof Error ? e.message : 'Не удалось выполнить задачу');
        })
        .finally(() => {
          completingTodoIdsRef.current.delete(todoId);
        });
    },
    async uncompleteTodo(todoId: number) {
      if (!accessToken) return undefined;
      try {
        const result = await uncompletePersonalTodo(accessToken, todoId);
        await reload({ silent: true });
        return { result, rewards: result.rewards };
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Не удалось вернуть задачу');
        throw e;
      }
    },
    async updateHabit(habitId: number, body: { title?: string; polarity?: HabitPolarity }) {
      if (!accessToken) return;
      setBusy(true);
      setError(null);
      try {
        const habit = await updatePersonalHabit(accessToken, habitId, body);
        setBoard((prev) =>
          prev
            ? { ...prev, habits: prev.habits.map((h) => (h.id === habitId ? habit : h)) }
            : prev,
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Не удалось изменить привычку');
        throw e;
      } finally {
        setBusy(false);
      }
    },
    async archiveHabit(habitId: number) {
      if (!accessToken) return;
      setBusy(true);
      setError(null);
      try {
        await archivePersonalHabit(accessToken, habitId);
        setBoard((prev) =>
          prev ? { ...prev, habits: prev.habits.filter((h) => h.id !== habitId) } : prev,
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Не удалось удалить привычку');
        throw e;
      } finally {
        setBusy(false);
      }
    },
    async updateDaily(dailyId: number, title: string) {
      if (!accessToken) return;
      setBusy(true);
      setError(null);
      try {
        const daily = await updatePersonalDaily(accessToken, dailyId, { title });
        setBoard((prev) =>
          prev
            ? {
                ...prev,
                dailies: prev.dailies.map((d) =>
                  d.id === dailyId ? { ...daily, completedToday: d.completedToday } : d,
                ),
              }
            : prev,
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Не удалось изменить ежедневную задачу');
        throw e;
      } finally {
        setBusy(false);
      }
    },
    async archiveDaily(dailyId: number) {
      if (!accessToken) return;
      setBusy(true);
      setError(null);
      try {
        await archivePersonalDaily(accessToken, dailyId);
        setBoard((prev) =>
          prev ? { ...prev, dailies: prev.dailies.filter((d) => d.id !== dailyId) } : prev,
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Не удалось удалить ежедневную задачу');
        throw e;
      } finally {
        setBusy(false);
      }
    },
    async updateTodo(todoId: number, title: string) {
      if (!accessToken) return;
      setBusy(true);
      setError(null);
      try {
        const todo = await updatePersonalTodo(accessToken, todoId, { title });
        setBoard((prev) =>
          prev ? { ...prev, todos: prev.todos.map((t) => (t.id === todoId ? todo : t)) } : prev,
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Не удалось изменить задачу');
        throw e;
      } finally {
        setBusy(false);
      }
    },
    async archiveTodo(todoId: number) {
      if (!accessToken) return;
      setBusy(true);
      setError(null);
      try {
        await archivePersonalTodo(accessToken, todoId);
        setBoard((prev) =>
          prev ? { ...prev, todos: prev.todos.filter((t) => t.id !== todoId) } : prev,
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Не удалось удалить задачу');
        throw e;
      } finally {
        setBusy(false);
      }
    },
  };
}
