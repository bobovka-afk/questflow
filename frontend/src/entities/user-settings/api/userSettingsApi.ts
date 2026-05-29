import { api } from '@shared/api';
import type {
  GamificationUserSettings,
  UserSecurityEventDto,
  UserSessionDto,
  UserSettingsDto,
} from '../model/types';

export async function fetchUserSettings(accessToken: string): Promise<UserSettingsDto> {
  return api<UserSettingsDto>('/user/me/settings', {
    method: 'GET',
    accessToken,
  });
}

export async function patchGamificationSettings(
  accessToken: string,
  patch: Partial<GamificationUserSettings>,
): Promise<UserSettingsDto> {
  return api<UserSettingsDto>('/user/me/settings/gamification', {
    method: 'PATCH',
    accessToken,
    json: patch,
  });
}

export async function fetchUserSessions(accessToken: string): Promise<UserSessionDto[]> {
  return api<UserSessionDto[]>('/user/me/sessions', {
    method: 'GET',
    accessToken,
  });
}

export async function revokeUserSession(
  accessToken: string,
  sessionId: string,
): Promise<void> {
  await api<{ ok: true }>(`/user/me/sessions/${sessionId}`, {
    method: 'DELETE',
    accessToken,
  });
}

export async function revokeOtherUserSessions(accessToken: string): Promise<void> {
  await api<{ ok: true }>('/user/me/sessions', {
    method: 'DELETE',
    accessToken,
  });
}

export async function fetchSecurityEvents(accessToken: string): Promise<UserSecurityEventDto[]> {
  return api<UserSecurityEventDto[]>('/user/me/security-events', {
    method: 'GET',
    accessToken,
  });
}
