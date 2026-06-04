export type GamificationUserSettings = {
  checkinAnimationOnCardClose: boolean;
  xpGainNotifications: boolean;
};

export type {
  PrivacyUserSettings,
} from '../lib/privacySettings';
export type {
  NotificationUserSettings,
} from '../lib/notificationSettings';

export type UserSettingsDto = {
  gamification: GamificationUserSettings;
  site: Record<string, unknown>;
  security: Record<string, unknown>;
  privacy: import('../lib/privacySettings').PrivacyUserSettings;
  notifications: import('../lib/notificationSettings').NotificationUserSettings;
  displayTimezone?: string | null;
  updatedAt: string;
};

export type UserSessionDto = {
  id: string;
  deviceLabel: string | null;
  userAgent: string | null;
  ipAddress: string | null;
  lastSeenAt: string;
  createdAt: string;
  expiresAt: string;
  isCurrent: boolean;
  isRevoked: boolean;
  isExpired?: boolean;
};

export type UserSecurityEventDto = {
  id: number;
  type: string;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  deviceLabel?: string | null;
  createdAt: string;
};

export const DEFAULT_GAMIFICATION_USER_SETTINGS: GamificationUserSettings = {
  checkinAnimationOnCardClose: true,
  xpGainNotifications: true,
};
