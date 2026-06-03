import { WorkspaceSearchService } from '../workspace-search.service';
import { PrismaService } from '../../prisma/prisma.service';
import { createPrismaMock } from '../../testing/prisma-mock';

describe('WorkspaceSearchService', () => {
  let service: WorkspaceSearchService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(() => {
    prisma = createPrismaMock();
    service = new WorkspaceSearchService(prisma as unknown as PrismaService);
  });

  it('returns empty for short query', async () => {
    await expect(service.search(1, 'a', {})).resolves.toEqual([]);
    expect(prisma.card!.findMany).not.toHaveBeenCalled();
  });

  it('searches cards in workspace', async () => {
    prisma.card!.findMany!.mockResolvedValue([
      {
        id: 3,
        title: 'Fix bug',
        description: null,
        dueDate: null,
        assigneeId: 1,
        list: {
          id: 2,
          name: 'Done',
          board: { id: 1, name: 'Board' },
        },
        comments: [],
      },
    ]);
    const hits = await service.search(10, 'bug', { limit: 10 });
    expect(hits).toHaveLength(1);
    expect(hits[0].cardId).toBe(3);
    expect(prisma.card!.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          list: expect.objectContaining({
            board: expect.objectContaining({ workspaceId: 10, archivedAt: null }),
          }),
        }),
      }),
    );
  });
});
