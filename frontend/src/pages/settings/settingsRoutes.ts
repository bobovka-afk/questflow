export type SettingsTab =
  | 'account'
  | 'security'
  | 'notifications'
  | 'gamification'
  | 'privacy';

const TAB_ROUTES: Record<SettingsTab, string> = {
  account: '/settings/account',
  security: '/settings/security',
  notifications: '/settings/notifications',
  gamification: '/settings/gamification',
  privacy: '/settings/privacy',
};

export const SETTINGS_TABS: SettingsTab[] = [
  'account',
  'security',
  'notifications',
  'gamification',
  'privacy',
];

export function parseSettingsTabFromRoute(route: string): SettingsTab {
  if (route.startsWith('/settings/gamification')) return 'gamification';
  if (route.startsWith('/settings/account') || route.startsWith('/settings/data')) {
    return 'account';
  }
  if (route.startsWith('/settings/security')) return 'security';
  if (route.startsWith('/settings/notifications')) return 'notifications';
  if (route.startsWith('/settings/privacy')) return 'privacy';
  if (route === '/settings' || route.startsWith('/settings/')) return 'security';
  return 'security';
}

export function settingsRouteForTab(tab: SettingsTab): string {
  return TAB_ROUTES[tab];
}

export const SETTINGS_TAB_LABELS: Record<SettingsTab, string> = {
  account: 'Аккаунт',
  security: 'Безопасность',
  notifications: 'Уведомления',
  gamification: 'Геймификация',
  privacy: 'Конфиденциальность',
};
