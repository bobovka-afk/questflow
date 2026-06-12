import { api } from '@shared/api/api';
import type {
  CompletedPersonalTodosPageDto,
  PersonalActionResponse,
  PersonalBoardDto,
  PersonalDailyDto,
  PersonalHabitDto,
  PersonalTodoDto,
  HabitPolarity,
} from '../model/types';

export function fetchPersonalBoard(accessToken: string) {
  return api<PersonalBoardDto>('/personal', { method: 'GET', accessToken });
}

export function createPersonalHabit(
  accessToken: string,
  body: { title: string; polarity?: HabitPolarity },
) {
  return api<PersonalHabitDto>('/personal/habits', {
    method: 'POST',
    accessToken,
    json: body,
  });
}

export function logPersonalHabit(
  accessToken: string,
  habitId: number,
  direction: 'positive' | 'negative',
) {
  return api<PersonalActionResponse>(`/personal/habits/${habitId}/log`, {
    method: 'POST',
    accessToken,
    json: { direction },
  });
}

export function createPersonalDaily(accessToken: string, body: { title: string }) {
  return api<PersonalDailyDto>('/personal/dailies', {
    method: 'POST',
    accessToken,
    json: body,
  });
}

export function completePersonalDaily(accessToken: string, dailyId: number) {
  return api<PersonalActionResponse>(`/personal/dailies/${dailyId}/complete`, {
    method: 'POST',
    accessToken,
  });
}

export function createPersonalTodo(
  accessToken: string,
  body: { title: string; notes?: string; dueAt?: string | null },
) {
  return api<PersonalTodoDto>('/personal/todos', {
    method: 'POST',
    accessToken,
    json: body,
  });
}

export function completePersonalTodo(accessToken: string, todoId: number) {
  return api<PersonalActionResponse>(`/personal/todos/${todoId}/complete`, {
    method: 'POST',
    accessToken,
  });
}

export function uncompletePersonalTodo(accessToken: string, todoId: number) {
  return api<PersonalActionResponse>(`/personal/todos/${todoId}/uncomplete`, {
    method: 'POST',
    accessToken,
  });
}

export function fetchCompletedPersonalTodos(
  accessToken: string,
  params: { limit: number; offset: number },
) {
  const query = new URLSearchParams({
    limit: String(params.limit),
    offset: String(params.offset),
  });
  return api<CompletedPersonalTodosPageDto>(
    `/personal/todos/completed?${query.toString()}`,
    {
      method: 'GET',
      accessToken,
    },
  );
}

export function updatePersonalHabit(
  accessToken: string,
  habitId: number,
  body: { title?: string; polarity?: HabitPolarity },
) {
  return api<PersonalHabitDto>(`/personal/habits/${habitId}`, {
    method: 'PATCH',
    accessToken,
    json: body,
  });
}

export function archivePersonalHabit(accessToken: string, habitId: number) {
  return api<PersonalHabitDto>(`/personal/habits/${habitId}`, {
    method: 'PATCH',
    accessToken,
    json: { archived: true },
  });
}

export function updatePersonalDaily(
  accessToken: string,
  dailyId: number,
  body: { title: string },
) {
  return api<PersonalDailyDto>(`/personal/dailies/${dailyId}`, {
    method: 'PATCH',
    accessToken,
    json: body,
  });
}

export function archivePersonalDaily(accessToken: string, dailyId: number) {
  return api<PersonalDailyDto>(`/personal/dailies/${dailyId}`, {
    method: 'PATCH',
    accessToken,
    json: { archived: true },
  });
}

export function updatePersonalTodo(
  accessToken: string,
  todoId: number,
  body: { title: string },
) {
  return api<PersonalTodoDto>(`/personal/todos/${todoId}`, {
    method: 'PATCH',
    accessToken,
    json: body,
  });
}

export function archivePersonalTodo(accessToken: string, todoId: number) {
  return api<PersonalTodoDto>(`/personal/todos/${todoId}`, {
    method: 'PATCH',
    accessToken,
    json: { archived: true },
  });
}
