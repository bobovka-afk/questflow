import { SpaLink } from '@shared/lib/navigation';
import { AppLogo } from '@shared/ui/app-logo/AppLogo';
import {
  RailIconCharacter,
  RailIconLogoutPower,
  RailIconNotifications,
  RailIconPersonal,
  RailIconSettings,
  RailIconThemeMoon,
  RailIconThemeSun,
  RailIconWorkspaces,
} from './RailNavIcons';

export type AppRailSection =
  | 'workspaces'
  | 'personal'
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
      <nav className="px-rail-nav" aria-label="Разделы">
        <SpaLink className="px-rail-logo" to="/personal" title="Привычки" aria-label="Questflow — привычки">
          <AppLogo />
        </SpaLink>

        <SpaLink
          className={`px-rail-btn px-rail-btn--nav${active === 'personal' ? ' px-rail-btn--active' : ''}`}
          to="/personal"
          aria-label="Привычки"
          aria-current={active === 'personal' ? 'page' : undefined}
        >
          <RailIconPersonal className="px-rail-btn__ico" />
          <span className="px-rail-flyout" aria-hidden>Привычки</span>
        </SpaLink>

        <SpaLink
          className={`px-rail-btn px-rail-btn--nav${active === 'workspaces' ? ' px-rail-btn--active' : ''}`}
          to="/workspaces"
          aria-label="Доски"
          aria-current={active === 'workspaces' ? 'page' : undefined}
        >
          <RailIconWorkspaces className="px-rail-btn__ico" />
          <span className="px-rail-flyout" aria-hidden>Доски</span>
        </SpaLink>

        <SpaLink
          className={`px-rail-btn px-rail-btn--nav${active === 'character' ? ' px-rail-btn--active' : ''}`}
          to="/profile/character"
          aria-label="Персонаж"
          aria-current={active === 'character' ? 'page' : undefined}
        >
          <RailIconCharacter className="px-rail-btn__ico" />
          <span className="px-rail-flyout" aria-hidden>Персонаж</span>
        </SpaLink>

        <SpaLink
          className={`px-rail-btn px-rail-btn--nav px-rail-btn--badge${active === 'notifications' ? ' px-rail-btn--active' : ''}`}
          to="/notifications"
          aria-label="Инфо"
          aria-current={active === 'notifications' ? 'page' : undefined}
        >
          <RailIconNotifications className="px-rail-btn__ico" />
          <span className="px-rail-flyout" aria-hidden>Инфо</span>
          <RailBadge count={notificationCount} />
        </SpaLink>

        <SpaLink
          className={`px-rail-btn px-rail-btn--nav${active === 'settings' ? ' px-rail-btn--active' : ''}`}
          to="/settings"
          aria-label="Опции"
          aria-current={active === 'settings' ? 'page' : undefined}
        >
          <RailIconSettings className="px-rail-btn__ico" />
          <span className="px-rail-flyout" aria-hidden>Опции</span>
        </SpaLink>
      </nav>

      <div className="px-rail-spacer" />

      <div className="px-rail-utility">
        <button
          type="button"
          className="px-rail-btn px-rail-btn--icon-only px-rail-btn--theme"
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
          aria-label="Выйти"
          onClick={onLogout}
        >
          <RailIconLogoutPower className="px-rail-btn__ico px-rail-power-icon" />
        </button>
      </div>
    </aside>
  );
}

export function resolveAppRailSection(pathname: string, _search: string): AppRailSection {
  if (pathname.startsWith('/settings')) return 'settings';
  if (pathname === '/notifications') return 'notifications';
  if (pathname.startsWith('/profile/character')) return 'character';
  if (pathname.startsWith('/personal')) return 'personal';
  return 'workspaces';
}
