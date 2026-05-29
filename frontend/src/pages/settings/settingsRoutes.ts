export type SettingsTab = 'security' | 'gamification';

export function parseSettingsTabFromRoute(route: string): SettingsTab {
  if (route.startsWith('/settings/gamification')) return 'gamification';
  return 'security';
}

export function settingsRouteForTab(tab: SettingsTab): string {
  return tab === 'gamification' ? '/settings/gamification' : '/settings';
}
