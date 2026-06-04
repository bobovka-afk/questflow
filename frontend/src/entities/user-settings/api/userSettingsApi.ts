import { api } from '@shared/api';
import type {
  GamificationUserSettings,
  PrivacyUserSettings,
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

export async function patchPrivacySettings(
  accessToken: string,
  patch: Partial<PrivacyUserSettings>,
): Promise<UserSettingsDto> {
  return api<UserSettingsDto>('/user/me/settings/privacy', {
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

export async function patchNotificationSettings(
  accessToken: string,
  patch: Partial<import('../lib/notificationSettings').NotificationUserSettings>,
): Promise<UserSettingsDto> {
  return api<UserSettingsDto>('/user/me/settings/notifications', {
    method: 'PATCH',
    accessToken,
    json: patch,
  });
}

export async function patchDisplayTimezone(
  accessToken: string,
  displayTimezone: string,
): Promise<UserSettingsDto> {
  return api<UserSettingsDto>('/user/me/settings/display-timezone', {
    method: 'PATCH',
    accessToken,
    json: { displayTimezone },
  });
}

export type PendingEmailChangeDto = {
  newEmail: string;
  oldConfirmed: boolean;
  newConfirmed: boolean;
  requestedAt: string;
} | null;

export async function fetchPendingEmailChange(
  accessToken: string,
): Promise<PendingEmailChangeDto> {
  return api<PendingEmailChangeDto>('/user/me/email-change/pending', {
    method: 'GET',
    accessToken,
  });
}

export async function requestEmailChange(
  accessToken: string,
  payload: { newEmail: string; currentPassword?: string },
): Promise<{ ok: boolean }> {
  return api<{ ok: boolean }>('/user/me/email-change/request', {
    method: 'POST',
    accessToken,
    json: payload,
  });
}

export async function deleteAccount(
  accessToken: string,
  payload: { password?: string; confirmPhrase?: string },
): Promise<{ ok: boolean }> {
  return api<{ ok: boolean }>('/user/me', {
    method: 'DELETE',
    accessToken,
    json: payload,
  });
}
