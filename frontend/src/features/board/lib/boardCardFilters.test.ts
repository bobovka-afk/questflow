import { describe, expect, it } from 'vitest';
import { filterBoardCards } from './boardCardFilters';

describe('filterBoardCards', () => {
  const cards = [
    {
      assigneeId: 1,
      dueDate: '2099-01-01T00:00:00.000Z',
      labels: [{ id: 10, name: 'Bug', colorPreset: 'RED' }],
    },
    {
      assigneeId: 2,
      dueDate: '2020-01-01T00:00:00.000Z',
      isCompleted: false,
      labels: [],
    },
    { assigneeId: null, dueDate: null, labels: [] },
  ];

  it('filters mine', () => {
    const out = filterBoardCards(cards, 'mine', null, 1);
    expect(out).toHaveLength(1);
    expect(out[0].assigneeId).toBe(1);
  });

  it('filters overdue', () => {
    const out = filterBoardCards(cards, 'overdue', null, null);
    expect(out).toHaveLength(1);
    expect(out[0].assigneeId).toBe(2);
  });

  it('filters by label', () => {
    const out = filterBoardCards(cards, 'all', 10, null);
    expect(out).toHaveLength(1);
  });
});
