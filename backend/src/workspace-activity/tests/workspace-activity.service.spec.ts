import { WorkspaceActivityType } from '../../generated/prisma/enums';
import { WorkspaceActivityService } from '../workspace-activity.service';
import { PrismaService } from '../../prisma/prisma.service';
import { createPrismaMock } from '../../testing/prisma-mock';

describe('WorkspaceActivityService', () => {
  let service: WorkspaceActivityService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(() => {
    prisma = createPrismaMock();
    service = new WorkspaceActivityService(
      prisma as unknown as PrismaService,
    );
  });

  it('records activity via transaction client', async () => {
    const db = {
      workspaceActivity: { create: jest.fn().mockResolvedValue({}) },
    };
    await service.record(db as never, {
      workspaceId: 1,
      actorUserId: 2,
      type: WorkspaceActivityType.WORKSPACE_CREATED,
      payload: { name: 'W' },
    });
    expect(db.workspaceActivity.create).toHaveBeenCalled();
  });

  it('lists activities with pagination', async () => {
    prisma.workspaceActivity!.findMany!.mockResolvedValue([]);
    await service.listByWorkspace(1, { limit: 10, offset: 0 });
    expect(prisma.workspaceActivity!.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 10, skip: 0 }),
    );
  });
});
