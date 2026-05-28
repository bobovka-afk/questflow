import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { ProfileToolbarOutletContext, useProfileToolbarOutlet } from './profileToolbarOutletContext';

export function ProfileToolbarOutletProvider({ children }: { children: ReactNode }) {
  const [outletEl, setOutletEl] = useState<HTMLElement | null>(null);
  const value = useMemo(() => ({ outletEl, setOutletEl }), [outletEl]);
  return (
    <ProfileToolbarOutletContext.Provider value={value}>{children}</ProfileToolbarOutletContext.Provider>
  );
}

/** В правой колонке шапки — сюда монтируется меню профиля, чтобы мини-аватар не уезжал при скролле страницы. */
export function ProfileToolbarAnchor() {
  const { setOutletEl } = useProfileToolbarOutlet();
  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      setOutletEl(node);
    },
    [setOutletEl],
  );
  return <div ref={ref} className="trello-topbar-profile-toolbar-host" />;
}
