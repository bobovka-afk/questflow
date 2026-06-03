import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useWorkspaceSearchHotkey } from './useWorkspaceSearchHotkey';

describe('useWorkspaceSearchHotkey', () => {
  beforeEach(() => {
    vi.stubGlobal('addEventListener', vi.fn());
    vi.stubGlobal('removeEventListener', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('registers listener when enabled', () => {
    const onOpen = vi.fn();
    renderHook(() => useWorkspaceSearchHotkey(onOpen, true));
    expect(window.addEventListener).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
    );
  });

  it('does not register when disabled', () => {
    renderHook(() => useWorkspaceSearchHotkey(vi.fn(), false));
    expect(window.addEventListener).not.toHaveBeenCalled();
  });
});
