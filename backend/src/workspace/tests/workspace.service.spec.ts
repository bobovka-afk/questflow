import { BadRequestException, NotFoundException } from '@nestjs/common';
import { WorkspaceService } from '../workspace.service';
import { WorkspaceActivityService } from '../../workspace-activity/workspace-activity.service';
import { PrismaService } from '../../prisma/prisma.service';
import { createPrismaMock } from '../../testing/prisma-mock';

describe('WorkspaceService', () => {
  let service: WorkspaceService;
  let prisma: ReturnType<typeof createPrismaMock>;
  let activityService: jest.Mocked<Pick<WorkspaceActivityService, 'record'>>;

  beforeEach(() => {
    prisma = createPrismaMock();
    activityService = { record: jest.fn() };
    service = new WorkspaceService(
      prisma as unknown as PrismaService,
      activityService as unknown as WorkspaceActivityService,
    );
  });

  it('getWorkspaceSummary throws when missing', async () => {
    prisma.workspace!.findUnique!.mockResolvedValue(null);
    await expect(service.getWorkspaceSummary(1, 2)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('updateWorkspace requires fields', async () => {
    await expect(service.updateWorkspace(1, {}, 2)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('getWorkspaceSummary returns role', async () => {
    prisma.workspace!.findUnique!.mockResolvedValue({
      id: 1,
      name: 'W',
      description: null,
    });
    prisma.workspaceMember!.findUnique!.mockResolvedValue({ role: 'OWNER' });
    const summary = await service.getWorkspaceSummary(1, 2);
    expect(summary.myRole).toBe('OWNER');
  });

  it('getUserWorkspaces paginates', async () => {
    prisma.workspaceMember!.findMany!.mockResolvedValue([]);
    await service.getUserWorkspaces(1, { limit: 10, offset: 0 });
    expect(prisma.workspaceMember!.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
      }),
    );
  });

  it('reorderUserWorkspace throws when membership missing', async () => {
    const tx = {
      workspaceMember: {
        findFirst: jest.fn().mockResolvedValue(null),
      },
    };
    prisma.$transaction!.mockImplementation(async (fn) => fn(tx as never));
    await expect(
      service.reorderUserWorkspace(1, { memberId: 99, position: 0 }),
    ).rejects.toThrow(NotFoundException);
  });

  it('reorderUserWorkspace updates sort order', async () => {
    const tx = {
      workspaceMember: {
        findFirst: jest.fn().mockResolvedValue({ id: 2 }),
        findMany: jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }, { id: 3 }]),
        update: jest.fn().mockResolvedValue({}),
      },
    };
    prisma.$transaction!.mockImplementation(async (fn) => fn(tx as never));
    await expect(
      service.reorderUserWorkspace(5, { memberId: 2, position: 0 }),
    ).resolves.toEqual({ ok: true });
    expect(tx.workspaceMember.update).toHaveBeenCalledTimes(3);
  });

  it('updateWorkspace updates and records activity', async () => {
    prisma.workspace!.findUnique!.mockResolvedValue({
      name: 'Old',
      description: 'd1',
    });
    const tx = {
      workspace: {
        update: jest.fn().mockResolvedValue({
          id: 1,
          name: 'New',
          description: 'd1',
        }),
      },
    };
    prisma.$transaction!.mockImplementation(async (fn) => fn(tx as never));
    const result = await service.updateWorkspace(
      1,
      { name: 'New' },
      2,
    );
    expect(result.name).toBe('New');
    expect(activityService.record).toHaveBeenCalled();
  });

  it('deleteWorkspace returns ok', async () => {
    prisma.workspace!.delete!.mockResolvedValue({});
    await expect(service.deleteWorkspace(1)).resolves.toEqual({ ok: true });
  });

  it('getWorkspaceOrThrow throws when missing', async () => {
    prisma.workspace!.findUnique!.mockResolvedValue(null);
    await expect(service.getWorkspaceOrThrow(1)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('createWorkspace runs transaction', async () => {
    const tx = {
      workspaceMember: {
        aggregate: jest.fn().mockResolvedValue({ _max: { sortOrder: 2 } }),
      },
      workspace: {
        create: jest.fn().mockResolvedValue({
          id: 1,
          name: 'W',
          description: null,
          createdAt: new Date(),
        }),
      },
    };
    prisma.$transaction!.mockImplementation(async (fn) => fn(tx as never));
    const result = await service.createWorkspace({ name: 'W' }, 5);
    expect(result.id).toBe(1);
    expect(activityService.record).toHaveBeenCalled();
  });
});
