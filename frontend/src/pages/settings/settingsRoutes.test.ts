import { describe, expect, it } from 'vitest';
import { parseSettingsTabFromRoute, settingsRouteForTab } from './settingsRoutes';

describe('settingsRoutes', () => {
  it('parses tab from route', () => {
    expect(parseSettingsTabFromRoute('/settings/privacy')).toBe('privacy');
    expect(parseSettingsTabFromRoute('/settings/gamification')).toBe('gamification');
    expect(parseSettingsTabFromRoute('/settings')).toBe('security');
    expect(parseSettingsTabFromRoute('/settings/security')).toBe('security');
  });

  it('maps tab to route', () => {
    expect(settingsRouteForTab('privacy')).toBe('/settings/privacy');
    expect(parseSettingsTabFromRoute('/settings/data')).toBe('account');
  });
});
