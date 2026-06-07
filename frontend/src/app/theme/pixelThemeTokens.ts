/** Default pixel UI themes — see docs/ui-themes.md */

export type AppThemeMode = 'light' | 'dark';

export type PixelThemeTokens = {
  bg: string;
  bg2: string;
  border: string;
  accent: string;
  text: string;
  muted: string;
  tile1: string;
  tile2: string;
  tile3: string;
  green: string;
  railEdge: string;
  btnEdge: string;
  logoBg: string;
  logoShadow: string;
  activeRail: string;
  activeRailText: string;
  primaryBg: string;
  primaryText: string;
  ghostBorder: string;
  tileAddBorder: string;
  titleShadow: string;
  insetDark: string;
  insetLight: string;
};

export const PIXEL_THEME_DARK_ROYAL: PixelThemeTokens = {
  bg: '#1a1033',
  bg2: '#2a1850',
  border: '#000',
  accent: '#ffe566',
  text: '#f0e6d3',
  muted: '#a898c8',
  tile1: '#4a6741',
  tile2: '#5c4a8a',
  tile3: '#8b4513',
  green: '#6bcb77',
  railEdge: '#5c4a8a',
  btnEdge: '#5c4a8a',
  logoBg: '#c9a227',
  logoShadow: '#8b6914',
  activeRail: '#4a6741',
  activeRailText: '#d4edc9',
  primaryBg: '#4a6741',
  primaryText: '#d4edc9',
  ghostBorder: '#5c4a8a',
  tileAddBorder: '#5c4a8a',
  titleShadow: '#000',
  insetDark: 'rgba(0,0,0,0.4)',
  insetLight: 'rgba(255,255,255,0.12)',
};

export const PIXEL_THEME_LIGHT_PARCHMENT: PixelThemeTokens = {
  bg: '#f0e6d0',
  bg2: '#e4d4b8',
  border: '#2a2018',
  accent: '#8b4513',
  text: '#2a2018',
  muted: '#7a6858',
  tile1: '#6b8c5a',
  tile2: '#9a7a58',
  tile3: '#b87840',
  green: '#4a8a50',
  railEdge: '#c8b898',
  btnEdge: '#c8b898',
  logoBg: '#c9a030',
  logoShadow: '#8b6914',
  activeRail: '#6b8c5a',
  activeRailText: '#f8fff0',
  primaryBg: '#6b8c5a',
  primaryText: '#f8fff0',
  ghostBorder: '#b8a888',
  tileAddBorder: '#b8a888',
  titleShadow: 'rgba(42,32,24,0.15)',
  insetDark: 'rgba(42,32,24,0.18)',
  insetLight: 'rgba(255,255,255,0.5)',
};

export function pixelTokensForMode(mode: AppThemeMode): PixelThemeTokens {
  return mode === 'dark' ? PIXEL_THEME_DARK_ROYAL : PIXEL_THEME_LIGHT_PARCHMENT;
}

const CSS_VAR_MAP: Array<[keyof PixelThemeTokens, string]> = [
  ['bg', '--px-bg'],
  ['bg2', '--px-bg2'],
  ['border', '--px-border'],
  ['accent', '--px-accent'],
  ['text', '--px-text'],
  ['muted', '--px-muted'],
  ['tile1', '--px-tile-1'],
  ['tile2', '--px-tile-2'],
  ['tile3', '--px-tile-3'],
  ['green', '--px-green'],
  ['railEdge', '--px-rail-edge'],
  ['btnEdge', '--px-btn-edge'],
  ['logoBg', '--px-logo-bg'],
  ['logoShadow', '--px-logo-shadow'],
  ['activeRail', '--px-active-rail'],
  ['activeRailText', '--px-active-rail-text'],
  ['primaryBg', '--px-primary-bg'],
  ['primaryText', '--px-primary-text'],
  ['ghostBorder', '--px-ghost-border'],
  ['tileAddBorder', '--px-tile-add-border'],
  ['titleShadow', '--px-title-shadow'],
  ['insetDark', '--px-inset-dark'],
  ['insetLight', '--px-inset-light'],
];

export function applyPixelThemeToDocument(mode: AppThemeMode) {
  const tokens = pixelTokensForMode(mode);
  const root = document.documentElement;
  root.classList.toggle('theme-dark', mode === 'dark');
  root.classList.add('px-ui');
  for (const [key, cssVar] of CSS_VAR_MAP) {
    root.style.setProperty(cssVar, tokens[key]);
  }
  root.style.setProperty('--qf-shell-gradient', tokens.bg);
  root.style.setProperty('--qf-shell-fg', tokens.text);
  root.style.setProperty('--qf-shell-fg-muted', tokens.muted);
  root.style.setProperty('--qf-text', tokens.text);
  root.style.setProperty('--qf-text-muted', tokens.muted);
  root.style.setProperty('--qf-body-bg', tokens.bg);
  root.style.setProperty('--qf-panel-bg', tokens.bg2);
  root.style.setProperty('--qf-panel-border', tokens.border);
}
