import type { GamificationUserSettings } from '../model/types';
import { DEFAULT_GAMIFICATION_USER_SETTINGS } from '../model/types';

/** @deprecated local cache key; settings live on server */
export const GAMIFICATION_SETTINGS_STORAGE_KEY = 'questflow_gamification_settings';

export const GAMIFICATION_SETTINGS_CHANGED_EVENT = 'questflow:gamification-settings-changed';

export type { GamificationUserSettings };
export { DEFAULT_GAMIFICATION_USER_SETTINGS };

export function notifyGamificationSettingsChanged(settings: GamificationUserSettings): void {
  window.dispatchEvent(
    new CustomEvent(GAMIFICATION_SETTINGS_CHANGED_EVENT, { detail: settings }),
  );
}
