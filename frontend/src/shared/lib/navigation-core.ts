import type { MouseEvent } from 'react';

const ABSOLUTE_HTTP = /^https?:\/\//i;

export function navigate(to: string) {
  window.history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function hrefForSpaRoute(to: string): string {
  if (ABSOLUTE_HTTP.test(to)) return to;
  const path = to.startsWith('/') ? to : `/${to}`;
  return `${window.location.origin}${path}`;
}

export function openSpaInNewTab(to: string) {
  window.open(hrefForSpaRoute(to), '_blank', 'noopener,noreferrer');
}

/** Click on tile: regular = SPA, Ctrl/Cmd/Middle = new tab. */
export function handleSpaTileClick(e: MouseEvent<HTMLElement>, to: string): void {
  if (e.button !== 0) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey) {
    e.preventDefault();
    openSpaInNewTab(to);
    return;
  }
  e.preventDefault();
  navigate(to);
}

export function handleSpaTileAuxClick(e: MouseEvent<HTMLElement>, to: string): void {
  if (e.button === 1) {
    e.preventDefault();
    openSpaInNewTab(to);
  }
}
