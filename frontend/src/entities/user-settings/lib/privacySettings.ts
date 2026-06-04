export type PrivacyUserSettings = {
  allowCharacterView: boolean;
  showAccountAvatarOnPublicProfile: boolean;
  allowFindByCharacterName: boolean;
  showOnlineStatusToFriends: boolean;
};

export const DEFAULT_PRIVACY_USER_SETTINGS: PrivacyUserSettings = {
  allowCharacterView: true,
  showAccountAvatarOnPublicProfile: true,
  allowFindByCharacterName: false,
  showOnlineStatusToFriends: true,
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
    allowFindByCharacterName:
      typeof o.allowFindByCharacterName === 'boolean'
        ? o.allowFindByCharacterName
        : DEFAULT_PRIVACY_USER_SETTINGS.allowFindByCharacterName,
    showOnlineStatusToFriends:
      typeof o.showOnlineStatusToFriends === 'boolean'
        ? o.showOnlineStatusToFriends
        : DEFAULT_PRIVACY_USER_SETTINGS.showOnlineStatusToFriends,
  };
}
