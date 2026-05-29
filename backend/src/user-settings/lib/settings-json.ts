import {
  DEFAULT_GAMIFICATION_SETTINGS,
  DEFAULT_SECURITY_SETTINGS,
  DEFAULT_SITE_SETTINGS,
  type GamificationSettingsJson,
  type SecuritySettingsJson,
  type SiteSettingsJson,
} from '../config/default-user-settings';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
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

export function parseSiteSettings(raw: unknown): SiteSettingsJson {
  return isRecord(raw) ? { ...raw } : { ...DEFAULT_SITE_SETTINGS };
}

export function parseSecuritySettings(raw: unknown): SecuritySettingsJson {
  return isRecord(raw) ? { ...raw } : { ...DEFAULT_SECURITY_SETTINGS };
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
