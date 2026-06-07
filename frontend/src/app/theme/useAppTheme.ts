import { useCallback, useEffect, useState } from 'react';
import { applyPixelThemeToDocument, type AppThemeMode } from './pixelThemeTokens';

const THEME_KEY = 'questflow_theme';
const THEME_KEY_LEGACY = 'mini_trello_theme';

function migrateLegacyThemeKey() {
  try {
    if (!localStorage.getItem(THEME_KEY) && localStorage.getItem(THEME_KEY_LEGACY)) {
      localStorage.setItem(THEME_KEY, localStorage.getItem(THEME_KEY_LEGACY)!);
      localStorage.removeItem(THEME_KEY_LEGACY);
    }
  } catch {
    /* ignore */
  }
}
migrateLegacyThemeKey();

function readInitialTheme(): AppThemeMode {
  try {
    const fromStorage = localStorage.getItem(THEME_KEY);
    if (fromStorage === 'light' || fromStorage === 'dark') return fromStorage;
  } catch {
    /* ignore */
  }
  return 'dark';
}

export function useAppTheme() {
  const [theme, setTheme] = useState<AppThemeMode>(() => {
    const initial = readInitialTheme();
    applyPixelThemeToDocument(initial);
    return initial;
  });

  useEffect(() => {
    applyPixelThemeToDocument(theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, setTheme, toggleTheme, isDark: theme === 'dark' };
}
