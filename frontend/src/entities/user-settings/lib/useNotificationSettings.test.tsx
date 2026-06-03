import { renderHook, waitFor, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useNotificationSettings } from './useNotificationSettings';
import * as userSettingsApi from '../api/userSettingsApi';
import { DEFAULT_NOTIFICATION_USER_SETTINGS } from './notificationSettings';
import { mockUserSettingsDto } from './testFixtures';

vi.mock('../api/userSettingsApi', () => ({
  fetchUserSettings: vi.fn(),
  patchNotificationSettings: vi.fn(),
}));

describe('useNotificationSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses defaults when access token is missing', () => {
    const { result } = renderHook(() => useNotificationSettings(null));
    expect(result.current[0]).toEqual(DEFAULT_NOTIFICATION_USER_SETTINGS);
    expect(userSettingsApi.fetchUserSettings).not.toHaveBeenCalled();
  });

  it('loads notifications from API', async () => {
    vi.mocked(userSettingsApi.fetchUserSettings).mockResolvedValue(
      mockUserSettingsDto({
        notifications: { emailSecurity: false, emailWorkspaceInvites: true },
      }),
    );

    const { result } = renderHook(() => useNotificationSettings('token'));

    await waitFor(() => {
      expect(result.current[2].loading).toBe(false);
    });

    expect(result.current[0].emailSecurity).toBe(false);
    expect(result.current[0].emailWorkspaceInvites).toBe(true);
  });

  it('persists notification patch', async () => {
    vi.mocked(userSettingsApi.fetchUserSettings).mockResolvedValue(mockUserSettingsDto());
    vi.mocked(userSettingsApi.patchNotificationSettings).mockResolvedValue(
      mockUserSettingsDto({
        notifications: { emailSecurity: false, emailWorkspaceInvites: true },
      }),
    );

    const { result } = renderHook(() => useNotificationSettings('token'));

    await waitFor(() => {
      expect(result.current[2].loading).toBe(false);
    });

    await act(async () => {
      await result.current[1]({ emailSecurity: false });
    });

    expect(userSettingsApi.patchNotificationSettings).toHaveBeenCalledWith('token', {
      emailSecurity: false,
    });
    expect(result.current[0].emailSecurity).toBe(false);
  });
});
