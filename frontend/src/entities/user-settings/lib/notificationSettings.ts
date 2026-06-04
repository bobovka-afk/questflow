export type NotificationUserSettings = {
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

export const DEFAULT_NOTIFICATION_USER_SETTINGS: NotificationUserSettings = {
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
};

export function parseNotificationSettings(raw: unknown): NotificationUserSettings {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return { ...DEFAULT_NOTIFICATION_USER_SETTINGS };
  }
  const o = raw as Record<string, unknown>;
  return {
    emailSecurity:
      typeof o.emailSecurity === 'boolean'
        ? o.emailSecurity
        : DEFAULT_NOTIFICATION_USER_SETTINGS.emailSecurity,
    emailWorkspaceInvites:
      typeof o.emailWorkspaceInvites === 'boolean'
        ? o.emailWorkspaceInvites
        : DEFAULT_NOTIFICATION_USER_SETTINGS.emailWorkspaceInvites,
    inAppGamification:
      typeof o.inAppGamification === 'boolean'
        ? o.inAppGamification
        : DEFAULT_NOTIFICATION_USER_SETTINGS.inAppGamification,
    inAppMentions:
      typeof o.inAppMentions === 'boolean'
        ? o.inAppMentions
        : DEFAULT_NOTIFICATION_USER_SETTINGS.inAppMentions,
    inAppDeadlines:
      typeof o.inAppDeadlines === 'boolean'
        ? o.inAppDeadlines
        : DEFAULT_NOTIFICATION_USER_SETTINGS.inAppDeadlines,
    inAppAssign:
      typeof o.inAppAssign === 'boolean'
        ? o.inAppAssign
        : DEFAULT_NOTIFICATION_USER_SETTINGS.inAppAssign,
    inAppSocial:
      typeof o.inAppSocial === 'boolean'
        ? o.inAppSocial
        : DEFAULT_NOTIFICATION_USER_SETTINGS.inAppSocial,
    pushAssign:
      typeof o.pushAssign === 'boolean'
        ? o.pushAssign
        : DEFAULT_NOTIFICATION_USER_SETTINGS.pushAssign,
    pushMention:
      typeof o.pushMention === 'boolean'
        ? o.pushMention
        : DEFAULT_NOTIFICATION_USER_SETTINGS.pushMention,
    pushFriendRequest:
      typeof o.pushFriendRequest === 'boolean'
        ? o.pushFriendRequest
        : DEFAULT_NOTIFICATION_USER_SETTINGS.pushFriendRequest,
  };
}
