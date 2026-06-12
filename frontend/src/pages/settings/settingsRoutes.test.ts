import { describe, expect, it } from 'vitest';
import {
  parseSettingsTabFromRoute,
  replaceSettingsTabInUrl,
  settingsRouteForTab,
} from './settingsRoutes';

describe('settingsRoutes', () => {
  it('parses tab from route', () => {
    expect(parseSettingsTabFromRoute('/settings/privacy')).toBe('privacy');
    expect(parseSettingsTabFromRoute('/settings/gamification')).toBe('gamification');
    expect(parseSettingsTabFromRoute('/settings')).toBe('account');
    expect(parseSettingsTabFromRoute('/settings/security')).toBe('security');
  });

  it('maps tab to route', () => {
    expect(settingsRouteForTab('privacy')).toBe('/settings/privacy');
    expect(parseSettingsTabFromRoute('/settings/data')).toBe('account');
  });

  it('replaces settings sub-route without changing unrelated URL parts', () => {
    window.history.replaceState({}, '', '/settings/security?emailChange=success#password');
    replaceSettingsTabInUrl('account');
    expect(window.location.pathname).toBe('/settings/account');
    expect(window.location.search).toBe('?emailChange=success');
    expect(window.location.hash).toBe('#password');
  });
});
