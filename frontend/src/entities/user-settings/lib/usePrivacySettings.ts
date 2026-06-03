import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchUserSettings, patchPrivacySettings } from '../api/userSettingsApi';
import {
  DEFAULT_PRIVACY_USER_SETTINGS,
  parsePrivacySettings,
  type PrivacyUserSettings,
} from './privacySettings';

type Meta = {
  loading: boolean;
  saving: boolean;
};

export function usePrivacySettings(accessToken: string | null) {
  const [settings, setSettings] = useState<PrivacyUserSettings>(DEFAULT_PRIVACY_USER_SETTINGS);
  const [meta, setMeta] = useState<Meta>({ loading: Boolean(accessToken), saving: false });
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    if (!accessToken) {
      setSettings(DEFAULT_PRIVACY_USER_SETTINGS);
      setMeta({ loading: false, saving: false });
      return;
    }

    let cancelled = false;
    setMeta((m) => ({ ...m, loading: true }));
    void (async () => {
      try {
        const res = await fetchUserSettings(accessToken);
        if (!cancelled) {
          setSettings(parsePrivacySettings(res.privacy));
        }
      } catch {
        if (!cancelled) setSettings(DEFAULT_PRIVACY_USER_SETTINGS);
      } finally {
        if (!cancelled) setMeta((m) => ({ ...m, loading: false }));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  const updateSettings = useCallback(
    async (patch: Partial<PrivacyUserSettings>) => {
      if (!accessToken) return;
      const previous = settingsRef.current;
      const next = { ...previous, ...patch };
      setSettings(next);
      setMeta((m) => ({ ...m, saving: true }));
      try {
        const res = await patchPrivacySettings(accessToken, next);
        setSettings(parsePrivacySettings(res.privacy));
      } catch {
        setSettings(previous);
      } finally {
        setMeta((m) => ({ ...m, saving: false }));
      }
    },
    [accessToken],
  );

  return [settings, updateSettings, meta] as const;
}
