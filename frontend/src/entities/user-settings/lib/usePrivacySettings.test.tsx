import { renderHook, waitFor, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePrivacySettings } from './usePrivacySettings';
import * as userSettingsApi from '../api/userSettingsApi';
import { DEFAULT_PRIVACY_USER_SETTINGS } from './privacySettings';
import { mockUserSettingsDto } from './testFixtures';

vi.mock('../api/userSettingsApi', () => ({
  fetchUserSettings: vi.fn(),
  patchPrivacySettings: vi.fn(),
}));

describe('usePrivacySettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses defaults when access token is missing', () => {
    const { result } = renderHook(() => usePrivacySettings(null));
    expect(result.current[0]).toEqual(DEFAULT_PRIVACY_USER_SETTINGS);
    expect(userSettingsApi.fetchUserSettings).not.toHaveBeenCalled();
  });

  it('loads privacy from API', async () => {
    vi.mocked(userSettingsApi.fetchUserSettings).mockResolvedValue(
      mockUserSettingsDto({
        privacy: {
          ...DEFAULT_PRIVACY_USER_SETTINGS,
          allowCharacterView: false,
          showAccountAvatarOnPublicProfile: true,
        },
      }),
    );

    const { result } = renderHook(() => usePrivacySettings('token'));

    await waitFor(() => {
      expect(result.current[2].loading).toBe(false);
    });

    expect(result.current[0].allowCharacterView).toBe(false);
  });

  it('persists privacy patch', async () => {
    vi.mocked(userSettingsApi.fetchUserSettings).mockResolvedValue(mockUserSettingsDto());
    vi.mocked(userSettingsApi.patchPrivacySettings).mockResolvedValue(
      mockUserSettingsDto({
        privacy: {
          ...DEFAULT_PRIVACY_USER_SETTINGS,
          allowCharacterView: false,
          showAccountAvatarOnPublicProfile: true,
        },
      }),
    );

    const { result } = renderHook(() => usePrivacySettings('token'));

    await waitFor(() => {
      expect(result.current[2].loading).toBe(false);
    });

    await act(async () => {
      await result.current[1]({ allowCharacterView: false });
    });

    expect(userSettingsApi.patchPrivacySettings).toHaveBeenCalledWith('token', {
      allowCharacterView: false,
      showAccountAvatarOnPublicProfile: true,
      allowFindByCharacterName: false,
      showOnlineStatusToFriends: true,
    });
    expect(result.current[0].allowCharacterView).toBe(false);
  });
});
