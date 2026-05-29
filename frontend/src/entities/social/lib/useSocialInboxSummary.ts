import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchSocialInboxSummary } from '../api/socialApi';
import type { SocialInboxSummary } from '../model/types';

const POLL_MS = 30_000;

const EMPTY: SocialInboxSummary = {
  incomingFriendRequests: 0,
  unreadMessages: 0,
};

export function useSocialInboxSummary(accessToken: string, enabled: boolean) {
  const [summary, setSummary] = useState<SocialInboxSummary>(EMPTY);

  const refresh = useCallback(async () => {
    if (!enabled) return;
    try {
      const data = await fetchSocialInboxSummary(accessToken);
      setSummary(data);
    } catch {
      /* ignore poll errors */
    }
  }, [accessToken, enabled]);

  useEffect(() => {
    void refresh();
    if (!enabled) return;
    const timer = window.setInterval(() => void refresh(), POLL_MS);
    return () => window.clearInterval(timer);
  }, [enabled, refresh]);

  const refreshRef = useRef(refresh);
  refreshRef.current = refresh;
  const refreshStable = useCallback(() => {
    void refreshRef.current();
  }, []);

  return { summary, refresh: refreshStable };
}
