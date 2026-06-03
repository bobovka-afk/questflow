import { useCallback, useEffect, useState } from 'react';
import { fetchUserSettings, patchNotificationSettings } from '../api/userSettingsApi';
import {
  DEFAULT_NOTIFICATION_USER_SETTINGS,
  parseNotificationSettings,
  type NotificationUserSettings,
} from './notificationSettings';

type Meta = { loading: boolean; saving: boolean };

export function useNotificationSettings(accessToken: string | null) {
  const [settings, setSettings] = useState<NotificationUserSettings>(
    DEFAULT_NOTIFICATION_USER_SETTINGS,
  );
  const [meta, setMeta] = useState<Meta>({ loading: Boolean(accessToken), saving: false });

  useEffect(() => {
    if (!accessToken) {
      setSettings(DEFAULT_NOTIFICATION_USER_SETTINGS);
      setMeta({ loading: false, saving: false });
      return;
    }
    let cancelled = false;
    setMeta((m) => ({ ...m, loading: true }));
    void (async () => {
      try {
        const res = await fetchUserSettings(accessToken);
        if (!cancelled) {
          setSettings(parseNotificationSettings(res.notifications));
        }
      } catch {
        if (!cancelled) setSettings(DEFAULT_NOTIFICATION_USER_SETTINGS);
      } finally {
        if (!cancelled) setMeta((m) => ({ ...m, loading: false }));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  const updateSettings = useCallback(
    async (patch: Partial<NotificationUserSettings>) => {
      if (!accessToken) return;
      setSettings((prev) => ({ ...prev, ...patch }));
      setMeta((m) => ({ ...m, saving: true }));
      try {
        const res = await patchNotificationSettings(accessToken, patch);
        setSettings(parseNotificationSettings(res.notifications));
      } catch {
        setSettings((prev) => ({ ...prev, ...patch }));
      } finally {
        setMeta((m) => ({ ...m, saving: false }));
      }
    },
    [accessToken],
  );

  return [settings, updateSettings, meta] as const;
}
