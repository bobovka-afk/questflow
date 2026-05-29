import { renderHook, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useMessagePolling } from './useMessagePolling';
import * as socialApi from '../api/socialApi';

vi.mock('../api/socialApi', async (importOriginal) => {
  const mod = await importOriginal<typeof import('../api/socialApi')>();
  return {
    ...mod,
    fetchSentMessageReceipts: vi.fn().mockResolvedValue([]),
  };
});

describe('useMessagePolling', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('polls on interval when enabled', async () => {
    const fetchSpy = vi.spyOn(socialApi, 'fetchMessagesWith').mockResolvedValue([
      {
        id: 2,
        senderId: 2,
        recipientId: 1,
        body: 'hey',
        readAt: null,
        createdAt: new Date().toISOString(),
      },
    ]);
    const onNew = vi.fn();

    renderHook(() =>
      useMessagePolling({
        accessToken: 'tok',
        peerUserId: 2,
        enabled: true,
        intervalMs: 5000,
        onNewMessages: onNew,
      }),
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });

    expect(fetchSpy).toHaveBeenCalled();
    expect(onNew).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ id: 2 })]),
    );
  });

  it('does not poll when disabled', async () => {
    const fetchSpy = vi.spyOn(socialApi, 'fetchMessagesWith');
    renderHook(() =>
      useMessagePolling({
        accessToken: 'tok',
        peerUserId: 2,
        enabled: false,
        onNewMessages: vi.fn(),
      }),
    );
    await act(async () => {
      await vi.advanceTimersByTimeAsync(10000);
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('fetches read receipts on poll when handler provided', async () => {
    vi.spyOn(socialApi, 'fetchMessagesWith').mockResolvedValue([]);
    const receiptsSpy = vi.mocked(socialApi.fetchSentMessageReceipts);
    receiptsSpy.mockResolvedValue([{ id: 1, readAt: '2026-05-28T12:00:00.000Z' }]);
    const onReceipts = vi.fn();

    renderHook(() =>
      useMessagePolling({
        accessToken: 'tok',
        peerUserId: 2,
        enabled: true,
        intervalMs: 5000,
        onNewMessages: vi.fn(),
        onReceiptsUpdate: onReceipts,
      }),
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });

    expect(receiptsSpy).toHaveBeenCalledWith('tok', 2);
    expect(onReceipts).toHaveBeenCalledWith([
      { id: 1, readAt: '2026-05-28T12:00:00.000Z' },
    ]);
  });
});
