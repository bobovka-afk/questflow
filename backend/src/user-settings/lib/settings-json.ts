import {
  DEFAULT_GAMIFICATION_SETTINGS,
  DEFAULT_PRIVACY_SETTINGS,
  DEFAULT_SECURITY_SETTINGS,
  DEFAULT_SITE_SETTINGS,
  type GamificationSettingsJson,
  type NotificationSettingsJson,
  type PrivacySettingsJson,
  type SecuritySettingsJson,
  type SiteSettingsJson,
} from '../config/default-user-settings';
import { mergeNotificationSettings } from '../../notification/notification-preferences';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parsePrivacySettings(raw: unknown): PrivacySettingsJson {
  if (!isRecord(raw)) return { ...DEFAULT_PRIVACY_SETTINGS };
  return {
    allowCharacterView:
      typeof raw.allowCharacterView === 'boolean'
        ? raw.allowCharacterView
        : DEFAULT_PRIVACY_SETTINGS.allowCharacterView,
    showAccountAvatarOnPublicProfile:
      typeof raw.showAccountAvatarOnPublicProfile === 'boolean'
        ? raw.showAccountAvatarOnPublicProfile
        : DEFAULT_PRIVACY_SETTINGS.showAccountAvatarOnPublicProfile,
    allowFindByCharacterName:
      typeof raw.allowFindByCharacterName === 'boolean'
        ? raw.allowFindByCharacterName
        : DEFAULT_PRIVACY_SETTINGS.allowFindByCharacterName,
    showOnlineStatusToFriends:
      typeof raw.showOnlineStatusToFriends === 'boolean'
        ? raw.showOnlineStatusToFriends
        : DEFAULT_PRIVACY_SETTINGS.showOnlineStatusToFriends,
  };
}

export function parseDisplayTimezone(raw: unknown): string | undefined {
  if (!isRecord(raw)) return undefined;
  return typeof raw.displayTimezone === 'string' && raw.displayTimezone.trim()
    ? raw.displayTimezone.trim()
    : undefined;
}

export function parseGamificationSettings(raw: unknown): GamificationSettingsJson {
  if (!isRecord(raw)) return { ...DEFAULT_GAMIFICATION_SETTINGS };
  return {
    checkinAnimationOnCardClose:
      typeof raw.checkinAnimationOnCardClose === 'boolean'
        ? raw.checkinAnimationOnCardClose
        : DEFAULT_GAMIFICATION_SETTINGS.checkinAnimationOnCardClose,
    xpGainNotifications:
      typeof raw.xpGainNotifications === 'boolean'
        ? raw.xpGainNotifications
        : DEFAULT_GAMIFICATION_SETTINGS.xpGainNotifications,
  };
}

export function parseNotificationSettings(raw: unknown): NotificationSettingsJson {
  return mergeNotificationSettings(raw);
}

export function parseSiteSettings(raw: unknown): SiteSettingsJson {
  if (!isRecord(raw)) return { ...DEFAULT_SITE_SETTINGS };
  const { notifications: notificationsRaw, ...rest } = raw;
  return {
    ...rest,
    notifications: parseNotificationSettings(notificationsRaw),
  };
}

export function parseSecuritySettings(raw: unknown): SecuritySettingsJson {
  if (!isRecord(raw)) return { ...DEFAULT_SECURITY_SETTINGS };
  const { privacy: privacyRaw, ...rest } = raw;
  return {
    ...rest,
    privacy: parsePrivacySettings(privacyRaw),
  };
}

export function deviceLabelFromUserAgent(userAgent: string | undefined): string | undefined {
  if (!userAgent) return undefined;
  if (/iPhone|iPad|Android|Mobile/i.test(userAgent)) return 'Мобильное устройство';
  if (/Windows/i.test(userAgent)) return 'Windows';
  if (/Mac OS X|Macintosh/i.test(userAgent)) return 'macOS';
  if (/Linux/i.test(userAgent)) return 'Linux';
  return 'Браузер';
}

export function clientIpFromForwarded(forwarded: string | string[] | undefined): string | undefined {
  if (!forwarded) return undefined;
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  const ip = raw?.split(',')[0]?.trim();
  return ip || undefined;
}
