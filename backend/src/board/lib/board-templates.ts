export const BOARD_TEMPLATE_KEYS = ['empty', 'kanban-dev', 'backlog'] as const;

export type BoardTemplateKey = (typeof BOARD_TEMPLATE_KEYS)[number];

export const BOARD_TEMPLATES: Record<BoardTemplateKey, { lists: string[] }> = {
  empty: { lists: [] },
  'kanban-dev': {
    lists: ['Бэклог', 'В работе', 'Ревью', 'Готово'],
  },
  backlog: {
    lists: ['Идеи', 'Запланировано', 'Готово'],
  },
};

export function isBoardTemplateKey(value: string): value is BoardTemplateKey {
  return (BOARD_TEMPLATE_KEYS as readonly string[]).includes(value);
}
