import { createContext, useContext } from 'react';

export type ProfileToolbarOutletContextValue = {
  outletEl: HTMLElement | null;
  setOutletEl: (el: HTMLElement | null) => void;
};

export const ProfileToolbarOutletContext = createContext<ProfileToolbarOutletContextValue | null>(null);

export function useProfileToolbarOutlet() {
  const ctx = useContext(ProfileToolbarOutletContext);
  if (!ctx) {
    throw new Error('useProfileToolbarOutlet: оберните приложение в ProfileToolbarOutletProvider');
  }
  return ctx;
}
