import { UserNotificationType } from '../generated/prisma/enums';
import {
  DEFAULT_NOTIFICATION_SETTINGS,
  type NotificationSettingsJson,
} from '../user-settings/config/default-user-settings';

export type InAppNotificationSettings = {
  inAppGamification: boolean;
  inAppMentions: boolean;
  inAppDeadlines: boolean;
  inAppAssign: boolean;
  inAppSocial: boolean;
};

export const DEFAULT_IN_APP_NOTIFICATION_SETTINGS: InAppNotificationSettings = {
  inAppGamification: true,
  inAppMentions: true,
  inAppDeadlines: true,
  inAppAssign: true,
  inAppSocial: true,
};

export function parseInAppNotificationSettings(
  raw: unknown,
): InAppNotificationSettings {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return { ...DEFAULT_IN_APP_NOTIFICATION_SETTINGS };
  }
  const o = raw as Record<string, unknown>;
  const pick = (key: keyof InAppNotificationSettings, fallback: boolean) =>
    typeof o[key] === 'boolean' ? o[key] : fallback;

  return {
    inAppGamification: pick('inAppGamification', true),
    inAppMentions: pick('inAppMentions', true),
    inAppDeadlines: pick('inAppDeadlines', true),
    inAppAssign: pick('inAppAssign', true),
    inAppSocial: pick('inAppSocial', true),
  };
}

export function mergeNotificationSettings(
  raw: unknown,
): NotificationSettingsJson & InAppNotificationSettings {
  const base =
    typeof raw === 'object' && raw !== null && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};
  return {
    emailSecurity:
      typeof base.emailSecurity === 'boolean'
        ? base.emailSecurity
        : DEFAULT_NOTIFICATION_SETTINGS.emailSecurity,
    emailWorkspaceInvites:
      typeof base.emailWorkspaceInvites === 'boolean'
        ? base.emailWorkspaceInvites
        : DEFAULT_NOTIFICATION_SETTINGS.emailWorkspaceInvites,
    ...parseInAppNotificationSettings(raw),
    pushAssign:
      typeof base.pushAssign === 'boolean'
        ? base.pushAssign
        : DEFAULT_NOTIFICATION_SETTINGS.pushAssign,
    pushMention:
      typeof base.pushMention === 'boolean'
        ? base.pushMention
        : DEFAULT_NOTIFICATION_SETTINGS.pushMention,
    pushFriendRequest:
      typeof base.pushFriendRequest === 'boolean'
        ? base.pushFriendRequest
        : DEFAULT_NOTIFICATION_SETTINGS.pushFriendRequest,
  };
}

export function isPushEnabledForType(
  settings: NotificationSettingsJson,
  type: UserNotificationType,
): boolean {
  switch (type) {
    case UserNotificationType.CARD_ASSIGNED:
      return settings.pushAssign;
    case UserNotificationType.MENTION:
      return settings.pushMention;
    case UserNotificationType.FRIEND_REQUEST:
      return settings.pushFriendRequest;
    default:
      return false;
  }
}

export function isInAppNotificationEnabled(
  settings: InAppNotificationSettings,
  type: UserNotificationType,
): boolean {
  switch (type) {
    case UserNotificationType.MENTION:
      return settings.inAppMentions;
    case UserNotificationType.DEADLINE:
      return settings.inAppDeadlines;
    case UserNotificationType.CARD_ASSIGNED:
      return settings.inAppAssign;
    case UserNotificationType.FRIEND_REQUEST:
    case UserNotificationType.PARTY_RAID_INVITE:
      return settings.inAppSocial;
    case UserNotificationType.XP_GAIN:
    case UserNotificationType.QUEST_COMPLETED:
    case UserNotificationType.CHEST_READY:
    case UserNotificationType.ACHIEVEMENT:
      return settings.inAppGamification;
    default:
      return true;
  }
}
