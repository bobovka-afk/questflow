import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchPartyMine } from '../api/partyApi';

const POLL_MS = 30_000;

export function usePartyInviteCount(accessToken: string, enabled: boolean) {
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!enabled) return;
    try {
      const mine = await fetchPartyMine(accessToken);
      setCount(mine.pendingInvites.length);
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

  return { count, refresh: refreshStable };
}
