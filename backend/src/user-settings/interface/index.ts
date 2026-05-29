import type {
  GamificationSettingsJson,
  SecuritySettingsJson,
  SiteSettingsJson,
} from '../config/default-user-settings';

export type UserSettingsView = {
  gamification: GamificationSettingsJson;
  site: SiteSettingsJson;
  security: SecuritySettingsJson;
  updatedAt: string;
};

export type UserSessionView = {
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

export type UserSecurityEventView = {
  id: number;
  type: string;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: string;
};

export type SessionRequestMeta = {
  userAgent?: string;
  ipAddress?: string;
};
