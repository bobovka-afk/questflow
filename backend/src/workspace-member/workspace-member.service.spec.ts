import { ForbiddenException } from '@nestjs/common';
import { WorkspaceRole } from '../generated/prisma/enums';
import { WorkspaceMemberService } from './workspace-member.service';
import { WorkspaceActivityService } from '../workspace-activity/workspace-activity.service';
import { PrismaService } from '../prisma/prisma.service';
import { createPrismaMock } from '../testing/prisma-mock';

describe('WorkspaceMemberService', () => {
  let service: WorkspaceMemberService;
  let prisma: ReturnType<typeof createPrismaMock>;
  let activityService: jest.Mocked<Pick<WorkspaceActivityService, 'record'>>;

  beforeEach(() => {
    prisma = createPrismaMock();
    activityService = { record: jest.fn() };
    service = new WorkspaceMemberService(
      prisma as unknown as PrismaService,
      activityService as unknown as WorkspaceActivityService,
    );
  });

  it('getWorkspaceMembers queries with pagination', async () => {
    prisma.workspaceMember!.findMany!.mockResolvedValue([]);
    await service.getWorkspaceMembers(1, { limit: 5, offset: 0 });
    expect(prisma.workspaceMember!.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 5, skip: 0 }),
    );
  });

  it('deleteWorkspaceMember removes member', async () => {
    const tx = {
      workspaceMember: {
        findUnique: jest.fn().mockResolvedValue({
          role: WorkspaceRole.MEMBER,
          user: { email: 'm@x.com', name: 'M' },
        }),
        delete: jest.fn(),
      },
    };
    prisma.$transaction!.mockImplementation(async (fn) => fn(tx as never));
    await expect(service.deleteWorkspaceMember(1, 2, 3)).resolves.toEqual({
      ok: true,
    });
  });

  it('leaveWorkspace removes membership', async () => {
    const tx = {
      workspaceMember: { delete: jest.fn() },
    };
    prisma.$transaction!.mockImplementation(async (fn) => fn(tx as never));
    await expect(service.leaveWorkspace(2, 1)).resolves.toEqual({ ok: true });
    expect(activityService.record).toHaveBeenCalled();
  });

  it('deleteWorkspaceMember forbids removing owner', async () => {
    const tx = {
      workspaceMember: {
        findUnique: jest.fn().mockResolvedValue({
          role: WorkspaceRole.OWNER,
          user: { email: 'o@x.com', name: 'O' },
        }),
        delete: jest.fn(),
      },
    };
    prisma.$transaction!.mockImplementation(async (fn) => fn(tx as never));
    await expect(service.deleteWorkspaceMember(1, 2, 3)).rejects.toThrow(
      ForbiddenException,
    );
  });
});
