export type PrivacyUserSettings = {
  allowCharacterView: boolean;
  showAccountAvatarOnPublicProfile: boolean;
};

export const DEFAULT_PRIVACY_USER_SETTINGS: PrivacyUserSettings = {
  allowCharacterView: true,
  showAccountAvatarOnPublicProfile: true,
};

export function parsePrivacySettings(raw: unknown): PrivacyUserSettings {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return { ...DEFAULT_PRIVACY_USER_SETTINGS };
  }
  const o = raw as Record<string, unknown>;
  return {
    allowCharacterView:
      typeof o.allowCharacterView === 'boolean'
        ? o.allowCharacterView
        : DEFAULT_PRIVACY_USER_SETTINGS.allowCharacterView,
    showAccountAvatarOnPublicProfile:
      typeof o.showAccountAvatarOnPublicProfile === 'boolean'
        ? o.showAccountAvatarOnPublicProfile
        : DEFAULT_PRIVACY_USER_SETTINGS.showAccountAvatarOnPublicProfile,
  };
}
