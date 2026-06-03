import {
  DEFAULT_GAMIFICATION_SETTINGS,
  DEFAULT_PRIVACY_SETTINGS,
  DEFAULT_SECURITY_SETTINGS,
  DEFAULT_SITE_SETTINGS,
} from '../../config/default-user-settings';
import {
  clientIpFromForwarded,
  deviceLabelFromUserAgent,
  parseGamificationSettings,
  parseNotificationSettings,
  parsePrivacySettings,
  parseSecuritySettings,
  parseSiteSettings,
} from '../settings-json';

describe('settings-json', () => {
  describe('parseGamificationSettings', () => {
    it('returns defaults for invalid payload', () => {
      expect(parseGamificationSettings(null)).toEqual(DEFAULT_GAMIFICATION_SETTINGS);
      expect(parseGamificationSettings([])).toEqual(DEFAULT_GAMIFICATION_SETTINGS);
    });

    it('merges known boolean fields and ignores unknown types', () => {
      expect(
        parseGamificationSettings({
          checkinAnimationOnCardClose: false,
          xpGainNotifications: 'yes',
        }),
      ).toEqual({
        checkinAnimationOnCardClose: false,
        xpGainNotifications: DEFAULT_GAMIFICATION_SETTINGS.xpGainNotifications,
      });
    });
  });

  describe('parseNotificationSettings', () => {
    it('returns defaults for invalid payload', () => {
      expect(parseNotificationSettings(null)).toEqual({
        emailSecurity: true,
        emailWorkspaceInvites: true,
      });
    });
  });

  describe('parseSiteSettings', () => {
    it('returns defaults for invalid payload', () => {
      expect(parseSiteSettings(undefined)).toEqual(DEFAULT_SITE_SETTINGS);
    });

    it('parses notifications nested field', () => {
      expect(
        parseSiteSettings({
          notifications: { emailSecurity: false },
        }),
      ).toEqual({
        notifications: {
          emailSecurity: false,
          emailWorkspaceInvites: true,
        },
      });
    });
  });

  describe('parsePrivacySettings', () => {
    it('returns defaults for invalid payload', () => {
      expect(parsePrivacySettings(null)).toEqual(DEFAULT_PRIVACY_SETTINGS);
    });

    it('merges known boolean fields', () => {
      expect(
        parsePrivacySettings({
          allowCharacterView: false,
          showAccountAvatarOnPublicProfile: 'no',
        }),
      ).toEqual({
        allowCharacterView: false,
        showAccountAvatarOnPublicProfile:
          DEFAULT_PRIVACY_SETTINGS.showAccountAvatarOnPublicProfile,
      });
    });
  });

  describe('parseSecuritySettings', () => {
    it('returns defaults with privacy for invalid payload', () => {
      expect(parseSecuritySettings(42)).toEqual(DEFAULT_SECURITY_SETTINGS);
    });

    it('parses nested privacy', () => {
      expect(
        parseSecuritySettings({
          privacy: { allowCharacterView: false },
        }),
      ).toEqual({
        privacy: {
          allowCharacterView: false,
          showAccountAvatarOnPublicProfile: true,
        },
      });
    });
  });

  describe('deviceLabelFromUserAgent', () => {
    it('detects common platforms', () => {
      expect(deviceLabelFromUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)')).toBe(
        'Мобильное устройство',
      );
      expect(deviceLabelFromUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')).toBe('Windows');
      expect(deviceLabelFromUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')).toBe(
        'macOS',
      );
      expect(deviceLabelFromUserAgent(undefined)).toBeUndefined();
    });
  });

  describe('clientIpFromForwarded', () => {
    it('takes first ip from forwarded header', () => {
      expect(clientIpFromForwarded('203.0.113.1, 10.0.0.1')).toBe('203.0.113.1');
      expect(clientIpFromForwarded(['198.51.100.2', '10.0.0.2'])).toBe('198.51.100.2');
      expect(clientIpFromForwarded(undefined)).toBeUndefined();
    });
  });
});
