export const DEFAULT_GAMIFICATION_SETTINGS = {
  checkinAnimationOnCardClose: true,
  xpGainNotifications: true,
} as const;

export type GamificationSettingsJson = {
  checkinAnimationOnCardClose: boolean;
  xpGainNotifications: boolean;
};

export type SiteSettingsJson = Record<string, unknown>;

export const DEFAULT_PRIVACY_SETTINGS = {
  allowCharacterView: true,
  showAccountAvatarOnPublicProfile: true,
} as const;

export type PrivacySettingsJson = {
  allowCharacterView: boolean;
  showAccountAvatarOnPublicProfile: boolean;
};

export type SecuritySettingsJson = {
  privacy: PrivacySettingsJson;
} & Record<string, unknown>;

export const DEFAULT_NOTIFICATION_SETTINGS = {
  emailSecurity: true,
  emailWorkspaceInvites: true,
} as const;

export type NotificationSettingsJson = {
  emailSecurity: boolean;
  emailWorkspaceInvites: boolean;
};

export const DEFAULT_SITE_SETTINGS: SiteSettingsJson = {
  notifications: { ...DEFAULT_NOTIFICATION_SETTINGS },
};

export const DEFAULT_SECURITY_SETTINGS: SecuritySettingsJson = {
  privacy: { ...DEFAULT_PRIVACY_SETTINGS },
};
