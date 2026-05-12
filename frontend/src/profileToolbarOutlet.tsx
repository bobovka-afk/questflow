import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type Ctx = {
  outletEl: HTMLElement | null;
  setOutletEl: (el: HTMLElement | null) => void;
};

const ProfileToolbarOutletContext = createContext<Ctx | null>(null);

export function ProfileToolbarOutletProvider({ children }: { children: ReactNode }) {
  const [outletEl, setOutletEl] = useState<HTMLElement | null>(null);
  const value = useMemo(() => ({ outletEl, setOutletEl }), [outletEl]);
  return (
    <ProfileToolbarOutletContext.Provider value={value}>{children}</ProfileToolbarOutletContext.Provider>
  );
}

export function useProfileToolbarOutlet() {
  const ctx = useContext(ProfileToolbarOutletContext);
  if (!ctx) {
    throw new Error('useProfileToolbarOutlet: оберните приложение в ProfileToolbarOutletProvider');
  }
  return ctx;
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
