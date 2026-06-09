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

/** Legacy — chest unlock candidate; not the app default */
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

/** Default dark theme — Slate Dungeon (#5 in design previews) */
export const PIXEL_THEME_DARK_SLATE: PixelThemeTokens = {
  bg: '#141820',
  bg2: '#222830',
  border: '#000',
  accent: '#90c0ff',
  text: '#e0e4ec',
  muted: '#8898a8',
  tile1: '#3a4858',
  tile2: '#4a5870',
  tile3: '#586878',
  green: '#70a890',
  railEdge: '#4a5870',
  btnEdge: '#4a5870',
  logoBg: '#8898a8',
  logoShadow: '#586878',
  activeRail: '#3a5878',
  activeRailText: '#c0d8f0',
  primaryBg: '#3a5878',
  primaryText: '#c0d8f0',
  ghostBorder: '#4a5870',
  tileAddBorder: '#586878',
  titleShadow: '#000',
  insetDark: 'rgba(0,0,0,0.4)',
  insetLight: 'rgba(255,255,255,0.14)',
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
  return mode === 'dark' ? PIXEL_THEME_DARK_SLATE : PIXEL_THEME_LIGHT_PARCHMENT;
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

const QF_CSS_VARS: ReadonlyArray<[keyof PixelThemeTokens, string]> = [
  ['bg', '--qf-shell-gradient'],
  ['text', '--qf-shell-fg'],
  ['muted', '--qf-shell-fg-muted'],
  ['text', '--qf-text'],
  ['muted', '--qf-text-muted'],
  ['bg', '--qf-body-bg'],
  ['bg2', '--qf-panel-bg'],
  ['border', '--qf-panel-border'],
];

const LEGACY_CSS_VAR_KEYS = [
  '--trello-primary',
  '--trello-primary-hover',
  '--trello-primary-contrast',
  '--trello-list-chrome',
] as const;

function legacyThemeValues(tokens: PixelThemeTokens, mode: AppThemeMode): Record<(typeof LEGACY_CSS_VAR_KEYS)[number], string> {
  return {
    '--trello-primary': tokens.accent,
    '--trello-primary-hover': mode === 'dark' ? '#b0d4ff' : tokens.accent,
    '--trello-primary-contrast': mode === 'dark' ? tokens.bg : tokens.primaryText,
    '--trello-list-chrome': tokens.bg2,
  };
}

export function applyPixelThemeTokensToElement(el: HTMLElement, tokens: PixelThemeTokens, mode?: AppThemeMode) {
  for (const [key, cssVar] of CSS_VAR_MAP) {
    el.style.setProperty(cssVar, tokens[key]);
  }
  for (const [key, cssVar] of QF_CSS_VARS) {
    el.style.setProperty(cssVar, tokens[key]);
  }
  const resolvedMode: AppThemeMode =
    mode ?? (document.documentElement.classList.contains('theme-dark') ? 'dark' : 'light');
  const legacy = legacyThemeValues(tokens, resolvedMode);
  for (const cssVar of LEGACY_CSS_VAR_KEYS) {
    el.style.setProperty(cssVar, legacy[cssVar]);
  }
}

export function clearPixelThemeTokensFromElement(el: HTMLElement) {
  for (const [, cssVar] of CSS_VAR_MAP) {
    el.style.removeProperty(cssVar);
  }
  for (const [, cssVar] of QF_CSS_VARS) {
    el.style.removeProperty(cssVar);
  }
  for (const cssVar of LEGACY_CSS_VAR_KEYS) {
    el.style.removeProperty(cssVar);
  }
}

export function applyPixelThemeToDocument(mode: AppThemeMode) {
  const tokens = pixelTokensForMode(mode);
  const root = document.documentElement;
  root.classList.toggle('theme-dark', mode === 'dark');
  root.classList.add('px-ui');
  applyPixelThemeTokensToElement(root, tokens, mode);
}
