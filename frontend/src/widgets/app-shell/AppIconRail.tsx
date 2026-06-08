import { SpaLink } from '@shared/lib/navigation';
import { AppLogo } from '@shared/ui/app-logo/AppLogo';

export type AppRailSection =
  | 'workspaces'
  | 'character'
  | 'notifications'
  | 'messages'
  | 'settings';

type Props = {
  active: AppRailSection;
  notificationCount: number;
  unreadMessages: number;
  themeIsDark: boolean;
  onThemeToggle: () => void;
  onLogout: () => void;
};

function RailBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="px-rail-badge" aria-hidden>
      {count > 99 ? '99+' : count}
    </span>
  );
}

export function AppIconRail({
  active,
  notificationCount,
  unreadMessages,
  themeIsDark,
  onThemeToggle,
  onLogout,
}: Props) {
  return (
    <aside className="px-rail" aria-label="Навигация">
      <SpaLink className="px-rail-logo" to="/workspaces" title="Questflow" aria-label="Questflow">
        <AppLogo />
      </SpaLink>

      <SpaLink
        className={`px-rail-btn${active === 'workspaces' ? ' px-rail-btn--active' : ''}`}
        to="/workspaces"
        title="Рабочие пространства"
        aria-current={active === 'workspaces' ? 'page' : undefined}
      >
        ▦
      </SpaLink>

      <SpaLink
        className={`px-rail-btn${active === 'character' ? ' px-rail-btn--active' : ''}`}
        to="/profile/character"
        title="Персонаж"
        aria-current={active === 'character' ? 'page' : undefined}
      >
        ⚔
      </SpaLink>

      <SpaLink
        className={`px-rail-btn px-rail-btn--badge${active === 'notifications' ? ' px-rail-btn--active' : ''}`}
        to="/notifications"
        title="Уведомления"
        aria-current={active === 'notifications' ? 'page' : undefined}
      >
        🔔
        <RailBadge count={notificationCount} />
      </SpaLink>

      <SpaLink
        className={`px-rail-btn px-rail-btn--badge${active === 'messages' ? ' px-rail-btn--active' : ''}`}
        to="/profile/character?tab=messages"
        title="Сообщения"
        aria-current={active === 'messages' ? 'page' : undefined}
      >
        ✉
        <RailBadge count={unreadMessages} />
      </SpaLink>

      <SpaLink
        className={`px-rail-btn${active === 'settings' ? ' px-rail-btn--active' : ''}`}
        to="/settings"
        title="Настройки"
        aria-current={active === 'settings' ? 'page' : undefined}
      >
        ⚙
      </SpaLink>

      <div className="px-rail-spacer" />

      <button
        type="button"
        className="px-rail-btn px-rail-btn--theme"
        title={themeIsDark ? 'Светлая тема' : 'Тёмная тема'}
        aria-label={themeIsDark ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'}
        onClick={onThemeToggle}
      >
        {themeIsDark ? '☀' : '☾'}
      </button>

      <button
        type="button"
        className="px-rail-btn px-rail-btn--logout"
        title="Выйти"
        aria-label="Выйти"
        onClick={onLogout}
      >
        <svg className="px-rail-power-icon" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="currentColor"
            d="M13 3h-2v8h2V3zm-1 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"
          />
        </svg>
      </button>
    </aside>
  );
}

export function resolveAppRailSection(pathname: string, search: string): AppRailSection {
  if (pathname.startsWith('/settings')) return 'settings';
  if (pathname === '/notifications') return 'notifications';
  if (pathname.startsWith('/profile/character')) {
    const tab = new URLSearchParams(search).get('tab');
    if (tab === 'messages') return 'messages';
    return 'character';
  }
  return 'workspaces';
}
