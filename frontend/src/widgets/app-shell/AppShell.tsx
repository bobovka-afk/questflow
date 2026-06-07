import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { api } from '@shared/api';
import { useSocialInboxSummary } from '@entities/social';
import { AppIconRail, resolveAppRailSection } from './AppIconRail';

type Props = {
  accessToken: string;
  route: string;
  themeIsDark: boolean;
  onThemeToggle: () => void;
  onLogout: () => void | Promise<void>;
  children: ReactNode;
};

export function AppShell({
  accessToken,
  route,
  themeIsDark,
  onThemeToggle,
  onLogout,
  children,
}: Props) {
  const search = typeof window !== 'undefined' ? window.location.search : '';
  const active = resolveAppRailSection(route, search);
  const { summary: inboxSummary } = useSocialInboxSummary(accessToken, true);
  const [notificationCount, setNotificationCount] = useState(0);

  const refreshNotificationCount = useCallback(async () => {
    try {
      const data = await api<{ count: number }>('/notifications/unread-count', {
        method: 'GET',
        accessToken,
      });
      setNotificationCount(data.count ?? 0);
    } catch {
      setNotificationCount(0);
    }
  }, [accessToken]);

  useEffect(() => {
    void refreshNotificationCount();
    const id = window.setInterval(() => void refreshNotificationCount(), 60_000);
    return () => window.clearInterval(id);
  }, [refreshNotificationCount, route]);

  return (
    <div className="px-shell">
      <AppIconRail
        active={active}
        notificationCount={notificationCount}
        unreadMessages={inboxSummary.unreadMessages}
        themeIsDark={themeIsDark}
        onThemeToggle={onThemeToggle}
        onLogout={() => void onLogout()}
      />
      <div className="px-main">{children}</div>
    </div>
  );
}
