import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PRIVACY_USER_SETTINGS,
  parsePrivacySettings,
} from './privacySettings';

describe('parsePrivacySettings', () => {
  it('returns defaults for invalid payload', () => {
    expect(parsePrivacySettings(null)).toEqual(DEFAULT_PRIVACY_USER_SETTINGS);
    expect(parsePrivacySettings([])).toEqual(DEFAULT_PRIVACY_USER_SETTINGS);
  });

  it('merges boolean fields', () => {
    expect(
      parsePrivacySettings({
        allowCharacterView: false,
        showAccountAvatarOnPublicProfile: true,
      }),
    ).toEqual({
      allowCharacterView: false,
      showAccountAvatarOnPublicProfile: true,
    });
  });

  it('ignores invalid field types', () => {
    expect(parsePrivacySettings({ allowCharacterView: 'no' })).toEqual({
      allowCharacterView: true,
      showAccountAvatarOnPublicProfile: true,
    });
  });
});
