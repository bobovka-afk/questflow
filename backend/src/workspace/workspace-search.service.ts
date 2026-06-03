import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type WorkspaceSearchHit = {
  cardId: number;
  title: string;
  boardId: number;
  boardName: string;
  listId: number;
  listName: string;
  assigneeId: number | null;
  dueDate: Date | null;
  snippet: string | null;
};

@Injectable()
export class WorkspaceSearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(
    workspaceId: number,
    query: string,
    opts: {
      boardId?: number;
      listId?: number;
      assigneeId?: number;
      limit?: number;
    },
  ): Promise<WorkspaceSearchHit[]> {
    const q = query.trim();
    if (q.length < 2) {
      return [];
    }

    const limit = Math.min(opts.limit ?? 30, 50);

    const cards = await this.prisma.card.findMany({
      where: {
        list: {
          archivedAt: null,
          board: {
            workspaceId,
            archivedAt: null,
            ...(opts.boardId ? { id: opts.boardId } : {}),
          },
          ...(opts.listId ? { id: opts.listId } : {}),
        },
        ...(opts.assigneeId !== undefined
          ? { assigneeId: opts.assigneeId }
          : {}),
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          {
            comments: {
              some: { body: { contains: q, mode: 'insensitive' } },
            },
          },
        ],
      },
      take: limit,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        dueDate: true,
        assigneeId: true,
        list: {
          select: {
            id: true,
            name: true,
            board: { select: { id: true, name: true } },
          },
        },
        comments: {
          where: { body: { contains: q, mode: 'insensitive' } },
          take: 1,
          select: { body: true },
        },
      },
    });

    return cards.map((c) => {
      let snippet: string | null = null;
      if (c.description?.toLowerCase().includes(q.toLowerCase())) {
        snippet = c.description.slice(0, 120);
      } else if (c.comments[0]?.body) {
        snippet = c.comments[0].body.slice(0, 120);
      }
      return {
        cardId: c.id,
        title: c.title,
        boardId: c.list.board.id,
        boardName: c.list.board.name,
        listId: c.list.id,
        listName: c.list.name,
        assigneeId: c.assigneeId,
        dueDate: c.dueDate,
        snippet,
      };
    });
  }
}
