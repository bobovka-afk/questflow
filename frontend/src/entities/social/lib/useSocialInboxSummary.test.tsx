import { renderHook, waitFor, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSocialInboxSummary } from './useSocialInboxSummary';
import * as socialApi from '../api/socialApi';

vi.mock('../api/socialApi', () => ({
  fetchSocialInboxSummary: vi.fn(),
}));

describe('useSocialInboxSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not fetch when disabled', () => {
    renderHook(() => useSocialInboxSummary('tok', false));
    expect(socialApi.fetchSocialInboxSummary).not.toHaveBeenCalled();
  });

  it('loads summary on mount when enabled', async () => {
    vi.mocked(socialApi.fetchSocialInboxSummary).mockResolvedValue({
      incomingFriendRequests: 1,
      unreadMessages: 4,
    });

    const { result } = renderHook(() => useSocialInboxSummary('tok', true));

    await waitFor(() => {
      expect(result.current.summary.unreadMessages).toBe(4);
    });
    expect(socialApi.fetchSocialInboxSummary).toHaveBeenCalledWith('tok');
  });

  it('refresh is stable across rerenders', async () => {
    vi.mocked(socialApi.fetchSocialInboxSummary).mockResolvedValue({
      incomingFriendRequests: 0,
      unreadMessages: 0,
    });

    const { result, rerender } = renderHook(
      ({ enabled }) => useSocialInboxSummary('tok', enabled),
      { initialProps: { enabled: true } },
    );

    await waitFor(() => {
      expect(socialApi.fetchSocialInboxSummary).toHaveBeenCalled();
    });

    const refreshFirst = result.current.refresh;
    rerender({ enabled: true });
    expect(result.current.refresh).toBe(refreshFirst);

    vi.mocked(socialApi.fetchSocialInboxSummary).mockResolvedValue({
      incomingFriendRequests: 2,
      unreadMessages: 1,
    });
    await act(async () => {
      await result.current.refresh();
    });
    expect(result.current.summary.incomingFriendRequests).toBe(2);
  });
});
