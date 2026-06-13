import { describe, expect, it } from 'vitest';
import { cloneCardsByListId, reorderCardsByListId } from './boardCardDnD';

type Row = { id: number; listId: number; title: string };

const initial: Record<number, Row[]> = {
  1: [
    { id: 10, listId: 1, title: 'A' },
    { id: 11, listId: 1, title: 'B' },
  ],
  2: [{ id: 20, listId: 2, title: 'C' }],
};

describe('reorderCardsByListId', () => {
  it('moves card to another list at destination index', () => {
    const next = reorderCardsByListId(
      initial,
      { droppableId: '1', index: 0 },
      { droppableId: '2', index: 1 },
      '10',
    );

    expect(next?.[1].map((row) => row.id)).toEqual([11]);
    expect(next?.[2].map((row) => row.id)).toEqual([20, 10]);
    expect(next?.[2][1]?.listId).toBe(2);
  });

  it('reorders within the same list', () => {
    const next = reorderCardsByListId(
      initial,
      { droppableId: '1', index: 0 },
      { droppableId: '1', index: 1 },
      '10',
    );

    expect(next?.[1].map((row) => row.id)).toEqual([11, 10]);
  });

  it('continues reordering after card moved to another list during drag', () => {
    const mid: Record<number, Row[]> = {
      1: [{ id: 11, listId: 1, title: 'B' }],
      2: [
        { id: 20, listId: 2, title: 'C' },
        { id: 10, listId: 2, title: 'A' },
      ],
    };

    const next = reorderCardsByListId(
      mid,
      { droppableId: '1', index: 0 },
      { droppableId: '2', index: 0 },
      '10',
    );

    expect(next?.[2].map((row) => row.id)).toEqual([10, 20]);
  });

  it('cloneCardsByListId creates shallow row copies', () => {
    const cloned = cloneCardsByListId(initial);
    cloned[1][0]!.title = 'Changed';
    expect(initial[1][0]?.title).toBe('A');
  });
});
