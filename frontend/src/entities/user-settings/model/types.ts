export type GamificationUserSettings = {
  checkinAnimationOnCardClose: boolean;
  xpGainNotifications: boolean;
};

export type UserSettingsDto = {
  gamification: GamificationUserSettings;
  site: Record<string, unknown>;
  security: Record<string, unknown>;
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
};

export type UserSecurityEventDto = {
  id: number;
  type: string;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: string;
};

export const DEFAULT_GAMIFICATION_USER_SETTINGS: GamificationUserSettings = {
  checkinAnimationOnCardClose: true,
  xpGainNotifications: true,
};
