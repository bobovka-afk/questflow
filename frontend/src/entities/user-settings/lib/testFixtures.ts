import type { UserSettingsDto } from '../model/types';
import { DEFAULT_GAMIFICATION_USER_SETTINGS } from './gamificationSettings';
import { DEFAULT_NOTIFICATION_USER_SETTINGS } from './notificationSettings';
import { DEFAULT_PRIVACY_USER_SETTINGS } from './privacySettings';

export function mockUserSettingsDto(
  overrides: Partial<UserSettingsDto> = {},
): UserSettingsDto {
  return {
    gamification: DEFAULT_GAMIFICATION_USER_SETTINGS,
    site: {},
    security: {},
    privacy: DEFAULT_PRIVACY_USER_SETTINGS,
    notifications: DEFAULT_NOTIFICATION_USER_SETTINGS,
    updatedAt: '2026-05-28T12:00:00.000Z',
    ...overrides,
  };
}
