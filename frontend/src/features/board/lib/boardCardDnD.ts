export type CardDragLocation = {
  droppableId: string;
  index: number;
};

export function cloneCardsByListId<T extends { id: number }>(
  map: Record<number, T[]>,
): Record<number, T[]> {
  const next: Record<number, T[]> = {};
  for (const [key, rows] of Object.entries(map)) {
    next[Number(key)] = rows.map((row) => ({ ...row }));
  }
  return next;
}

function findCardLocation<T extends { id: number }>(
  map: Record<number, T[]>,
  cardId: number,
): { listId: number; index: number } | null {
  for (const [listKey, rows] of Object.entries(map)) {
    const index = rows.findIndex((row) => row.id === cardId);
    if (index >= 0) {
      return { listId: Number(listKey), index };
    }
  }
  return null;
}

export function reorderCardsByListId<T extends { id: number; listId: number }>(
  prev: Record<number, T[]>,
  _source: CardDragLocation,
  destination: CardDragLocation,
  draggableId: string,
): Record<number, T[]> | null {
  const cardId = Number(draggableId);
  if (!Number.isFinite(cardId)) return null;

  const destListId = Number(destination.droppableId);
  if (!Number.isFinite(destListId)) return null;

  const next = cloneCardsByListId(prev);
  const located = findCardLocation(next, cardId);
  if (!located) return null;

  const { listId: sourceListId, index: fromIdx } = located;
  const sourceRows = [...(next[sourceListId] ?? [])];
  const [removed] = sourceRows.splice(fromIdx, 1);
  if (!removed) return null;

  if (sourceListId === destListId) {
    sourceRows.splice(destination.index, 0, removed);
    next[sourceListId] = sourceRows;
    return next;
  }

  next[sourceListId] = sourceRows;
  const destRows = [...(next[destListId] ?? [])];
  destRows.splice(destination.index, 0, { ...removed, listId: destListId });
  next[destListId] = destRows;
  return next;
}

export function getCardListLocation<T extends { id: number }>(
  map: Record<number, T[]>,
  cardId: number,
): { listId: number; index: number } | null {
  return findCardLocation(map, cardId);
}
