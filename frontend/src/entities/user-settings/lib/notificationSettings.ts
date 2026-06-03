export type NotificationUserSettings = {
  emailSecurity: boolean;
  emailWorkspaceInvites: boolean;
};

export const DEFAULT_NOTIFICATION_USER_SETTINGS: NotificationUserSettings = {
  emailSecurity: true,
  emailWorkspaceInvites: true,
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
  };
}
