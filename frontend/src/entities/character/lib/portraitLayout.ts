/**
 * Согласованная вёрстка портрета + рамки (профиль, май 2026).
 * При переносе на другой экран — те же классы, контейнер и portraitFrameFitVars().
 *
 * Компонент: CharacterPortraitWithFrame.tsx
 * CSS: index.css (.trello-character-profile-portrait-*)
 * Константы рамок: cosmetics.ts → portraitFrameFitVars, PORTRAIT_FRAME_*
 */

/** Макс. сторона квадратного контейнера в UI (px). */
export const PORTRAIT_CONTAINER_MAX_PX = 300;

/** Исходники avatar + frame PNG. */
export const PORTRAIT_ASSET_CANVAS_PX = 1024;

/** Эталон bbox для позиции рамки (все frame_*.png подгоняются так же). */
export const PORTRAIT_FRAME_FIT_REF = {
  canvas: PORTRAIT_ASSET_CANVAS_PX,
  x0: 103,
  y0: 126,
  x1: 921,
  y1: 878,
} as const;

/** Inset scale после bbox: bronze / mystic / epic_flame. */
export const PORTRAIT_FRAME_INSET_SCALE_DEFAULT = 0.92;

/** Inset scale overrides per frame key. */
export const PORTRAIT_FRAME_INSET_SCALE_OVERRIDES: Partial<Record<string, number>> = {
  frame_silver: 0.97,
  frame_gold: 0.98,
  frame_mystic: 1,
};

/** Точечная геометрия после bbox/inset (для ручной визуальной подгонки). */
export const PORTRAIT_FRAME_AXIS_OVERRIDES: Partial<
  Record<string, { scaleX?: number; scaleY?: number; translateY?: number }>
> = {
  // Бронзу делаем шире по бокам (left/right) примерно на +0.02.
  frame_bronze: { scaleX: 0.94 },
  // Серебряную рамку чуть вытягиваем вверх и поднимаем.
  frame_silver: { scaleY: 0.99, translateY: -1 },
};

/** Классы — не менять без правки index.css. */
export const PORTRAIT_LAYOUT_CLASSES = {
  wrap: 'trello-character-profile-portrait-wrap trello-character-profile-portrait-wrap--square',
  stack: 'trello-character-profile-portrait-stack',
  stackFramed: 'trello-character-profile-portrait-stack trello-character-profile-portrait-stack--framed',
  portrait: 'trello-character-profile-portrait',
  frame: 'trello-character-profile-portrait-frame',
} as const;
