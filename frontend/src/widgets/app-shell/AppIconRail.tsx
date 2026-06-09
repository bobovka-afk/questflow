import { SpaLink } from '@shared/lib/navigation';
import { AppLogo } from '@shared/ui/app-logo/AppLogo';
import {
  RailIconCharacter,
  RailIconLogoutPower,
  RailIconNotifications,
  RailIconSettings,
  RailIconThemeMoon,
  RailIconThemeSun,
  RailIconWorkspaces,
} from './RailNavIcons';

export type AppRailSection =
  | 'workspaces'
  | 'character'
  | 'notifications'
  | 'settings';

type Props = {
  active: AppRailSection;
  notificationCount: number;
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
        className={`px-rail-btn px-rail-btn--nav${active === 'workspaces' ? ' px-rail-btn--active' : ''}`}
        to="/workspaces"
        title="Рабочие пространства"
        aria-current={active === 'workspaces' ? 'page' : undefined}
      >
        <RailIconWorkspaces className="px-rail-btn__ico" />
        <span className="px-rail-btn__label">Доски</span>
      </SpaLink>

      <SpaLink
        className={`px-rail-btn px-rail-btn--nav${active === 'character' ? ' px-rail-btn--active' : ''}`}
        to="/profile/character"
        title="Персонаж"
        aria-current={active === 'character' ? 'page' : undefined}
      >
        <RailIconCharacter className="px-rail-btn__ico" />
        <span className="px-rail-btn__label">Персонаж</span>
      </SpaLink>

      <SpaLink
        className={`px-rail-btn px-rail-btn--nav px-rail-btn--badge${active === 'notifications' ? ' px-rail-btn--active' : ''}`}
        to="/notifications"
        title="Уведомления"
        aria-current={active === 'notifications' ? 'page' : undefined}
      >
        <RailIconNotifications className="px-rail-btn__ico" />
        <span className="px-rail-btn__label">Инфо</span>
        <RailBadge count={notificationCount} />
      </SpaLink>

      <SpaLink
        className={`px-rail-btn px-rail-btn--nav${active === 'settings' ? ' px-rail-btn--active' : ''}`}
        to="/settings"
        title="Настройки"
        aria-current={active === 'settings' ? 'page' : undefined}
      >
        <RailIconSettings className="px-rail-btn__ico" />
        <span className="px-rail-btn__label">Опции</span>
      </SpaLink>

      <div className="px-rail-spacer" />

      <button
        type="button"
        className="px-rail-btn px-rail-btn--icon-only px-rail-btn--theme"
        title={themeIsDark ? 'Светлая тема' : 'Тёмная тема'}
        aria-label={themeIsDark ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'}
        onClick={onThemeToggle}
      >
        {themeIsDark ? (
          <RailIconThemeSun className="px-rail-btn__ico" />
        ) : (
          <RailIconThemeMoon className="px-rail-btn__ico" />
        )}
      </button>

      <button
        type="button"
        className="px-rail-btn px-rail-btn--icon-only px-rail-btn--logout"
        title="Выйти"
        aria-label="Выйти"
        onClick={onLogout}
      >
        <RailIconLogoutPower className="px-rail-btn__ico px-rail-power-icon" />
      </button>
    </aside>
  );
}

export function resolveAppRailSection(pathname: string, _search: string): AppRailSection {
  if (pathname.startsWith('/settings')) return 'settings';
  if (pathname === '/notifications') return 'notifications';
  if (pathname.startsWith('/profile/character')) return 'character';
  return 'workspaces';
}
