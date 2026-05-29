import { useCallback, useEffect, useState } from 'react';
import { patchGamificationSettings, fetchUserSettings } from '../api/userSettingsApi';
import {
  DEFAULT_GAMIFICATION_USER_SETTINGS,
  GAMIFICATION_SETTINGS_CHANGED_EVENT,
  notifyGamificationSettingsChanged,
  type GamificationUserSettings,
} from './gamificationSettings';

export function useGamificationSettings(accessToken: string | null): [
  GamificationUserSettings,
  (patch: Partial<GamificationUserSettings>) => void,
  { loading: boolean; saving: boolean },
] {
  const [settings, setSettings] = useState<GamificationUserSettings>(
    DEFAULT_GAMIFICATION_USER_SETTINGS,
  );
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      setSettings(DEFAULT_GAMIFICATION_USER_SETTINGS);
      return;
    }

    let cancelled = false;
    setLoading(true);
    void (async () => {
      try {
        const res = await fetchUserSettings(accessToken);
        if (!cancelled) {
          setSettings(res.gamification);
          notifyGamificationSettingsChanged(res.gamification);
        }
      } catch {
        if (!cancelled) setSettings(DEFAULT_GAMIFICATION_USER_SETTINGS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  useEffect(() => {
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<GamificationUserSettings>).detail;
      if (detail) setSettings(detail);
    };
    window.addEventListener(GAMIFICATION_SETTINGS_CHANGED_EVENT, onChange);
    return () => window.removeEventListener(GAMIFICATION_SETTINGS_CHANGED_EVENT, onChange);
  }, []);

  const update = useCallback(
    (patch: Partial<GamificationUserSettings>) => {
      if (!accessToken) return;

      const previous = settings;
      const optimistic = { ...settings, ...patch };
      setSettings(optimistic);
      notifyGamificationSettingsChanged(optimistic);
      setSaving(true);

      void (async () => {
        try {
          const res = await patchGamificationSettings(accessToken, patch);
          setSettings(res.gamification);
          notifyGamificationSettingsChanged(res.gamification);
        } catch {
          setSettings(previous);
          notifyGamificationSettingsChanged(previous);
        } finally {
          setSaving(false);
        }
      })();
    },
    [accessToken, settings],
  );

  return [settings, update, { loading, saving }];
}
