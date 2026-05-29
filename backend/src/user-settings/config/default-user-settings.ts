export const DEFAULT_GAMIFICATION_SETTINGS = {
  checkinAnimationOnCardClose: true,
  xpGainNotifications: true,
} as const;

export type GamificationSettingsJson = {
  checkinAnimationOnCardClose: boolean;
  xpGainNotifications: boolean;
};

export type SiteSettingsJson = Record<string, unknown>;
export type SecuritySettingsJson = Record<string, unknown>;

export const DEFAULT_SITE_SETTINGS: SiteSettingsJson = {};
export const DEFAULT_SECURITY_SETTINGS: SecuritySettingsJson = {};
