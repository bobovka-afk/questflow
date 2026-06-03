import { useEffect } from 'react';

/** Trello-style: Cmd+K (mac) / Ctrl+K (win/linux) */
export function useWorkspaceSearchHotkey(
  onOpen: () => void,
  enabled: boolean,
): void {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'k') return;
      const target = e.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT')
      ) {
        return;
      }
      e.preventDefault();
      onOpen();
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onOpen, enabled]);
}
