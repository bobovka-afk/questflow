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
  allowFindByCharacterName: false,
  showOnlineStatusToFriends: true,
} as const;

export type PrivacySettingsJson = {
  allowCharacterView: boolean;
  showAccountAvatarOnPublicProfile: boolean;
  allowFindByCharacterName: boolean;
  showOnlineStatusToFriends: boolean;
};

export const DEFAULT_DISPLAY_TIMEZONE = 'UTC';

export type SiteDisplaySettings = {
  displayTimezone?: string;
};

export type SecuritySettingsJson = {
  privacy: PrivacySettingsJson;
} & Record<string, unknown>;

export const DEFAULT_NOTIFICATION_SETTINGS = {
  emailSecurity: true,
  emailWorkspaceInvites: true,
  inAppGamification: true,
  inAppMentions: true,
  inAppDeadlines: true,
  inAppAssign: true,
  inAppSocial: true,
  pushAssign: false,
  pushMention: false,
  pushFriendRequest: false,
} as const;

export type NotificationSettingsJson = {
  emailSecurity: boolean;
  emailWorkspaceInvites: boolean;
  inAppGamification: boolean;
  inAppMentions: boolean;
  inAppDeadlines: boolean;
  inAppAssign: boolean;
  inAppSocial: boolean;
  pushAssign: boolean;
  pushMention: boolean;
  pushFriendRequest: boolean;
};

export const DEFAULT_SITE_SETTINGS: SiteSettingsJson = {
  notifications: { ...DEFAULT_NOTIFICATION_SETTINGS },
};

export const DEFAULT_SECURITY_SETTINGS: SecuritySettingsJson = {
  privacy: { ...DEFAULT_PRIVACY_SETTINGS },
};
