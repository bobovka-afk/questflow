import { renderHook, waitFor, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useGamificationSettings } from './useGamificationSettings';
import * as userSettingsApi from '../api/userSettingsApi';
import { DEFAULT_GAMIFICATION_USER_SETTINGS } from './gamificationSettings';

vi.mock('../api/userSettingsApi', () => ({
  fetchUserSettings: vi.fn(),
  patchGamificationSettings: vi.fn(),
}));

describe('useGamificationSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses defaults when access token is missing', () => {
    const { result } = renderHook(() => useGamificationSettings(null));
    expect(result.current[0]).toEqual(DEFAULT_GAMIFICATION_USER_SETTINGS);
    expect(userSettingsApi.fetchUserSettings).not.toHaveBeenCalled();
  });

  it('loads settings from API when access token is present', async () => {
    vi.mocked(userSettingsApi.fetchUserSettings).mockResolvedValue({
      gamification: {
        checkinAnimationOnCardClose: false,
        xpGainNotifications: true,
      },
      site: {},
      security: {},
      updatedAt: '2026-05-28T12:00:00.000Z',
    });

    const { result } = renderHook(() => useGamificationSettings('token-1'));

    await waitFor(() => {
      expect(result.current[2].loading).toBe(false);
    });

    expect(result.current[0]).toEqual({
      checkinAnimationOnCardClose: false,
      xpGainNotifications: true,
    });
    expect(userSettingsApi.fetchUserSettings).toHaveBeenCalledWith('token-1');
  });

  it('falls back to defaults when fetch fails', async () => {
    vi.mocked(userSettingsApi.fetchUserSettings).mockRejectedValue(new Error('network'));

    const { result } = renderHook(() => useGamificationSettings('token-1'));

    await waitFor(() => {
      expect(result.current[2].loading).toBe(false);
    });

    expect(result.current[0]).toEqual(DEFAULT_GAMIFICATION_USER_SETTINGS);
  });

  it('optimistically updates and persists gamification patch', async () => {
    vi.mocked(userSettingsApi.fetchUserSettings).mockResolvedValue({
      gamification: DEFAULT_GAMIFICATION_USER_SETTINGS,
      site: {},
      security: {},
      updatedAt: '2026-05-28T12:00:00.000Z',
    });
    vi.mocked(userSettingsApi.patchGamificationSettings).mockResolvedValue({
      gamification: {
        checkinAnimationOnCardClose: true,
        xpGainNotifications: false,
      },
      site: {},
      security: {},
      updatedAt: '2026-05-28T12:01:00.000Z',
    });

    const { result } = renderHook(() => useGamificationSettings('token-1'));

    await waitFor(() => {
      expect(result.current[2].loading).toBe(false);
    });

    act(() => {
      result.current[1]({ xpGainNotifications: false });
    });

    expect(result.current[0].xpGainNotifications).toBe(false);

    await waitFor(() => {
      expect(result.current[2].saving).toBe(false);
    });

    expect(userSettingsApi.patchGamificationSettings).toHaveBeenCalledWith('token-1', {
      xpGainNotifications: false,
    });
    expect(result.current[0].xpGainNotifications).toBe(false);
  });

  it('rolls back optimistic update when patch fails', async () => {
    vi.mocked(userSettingsApi.fetchUserSettings).mockResolvedValue({
      gamification: DEFAULT_GAMIFICATION_USER_SETTINGS,
      site: {},
      security: {},
      updatedAt: '2026-05-28T12:00:00.000Z',
    });
    vi.mocked(userSettingsApi.patchGamificationSettings).mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() => useGamificationSettings('token-1'));

    await waitFor(() => {
      expect(result.current[2].loading).toBe(false);
    });

    act(() => {
      result.current[1]({ xpGainNotifications: false });
    });

    await waitFor(() => {
      expect(result.current[2].saving).toBe(false);
    });

    expect(result.current[0]).toEqual(DEFAULT_GAMIFICATION_USER_SETTINGS);
  });
});
