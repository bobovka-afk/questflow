import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WorkspaceRole } from '../../../generated/prisma/enums';
import { WorkspaceRoleGuard } from '../workspace-role.guard';
import { PrismaService } from '../../../prisma/prisma.service';
import { createPrismaMock } from '../../../testing/prisma-mock';

describe('WorkspaceRoleGuard', () => {
  let guard: WorkspaceRoleGuard;
  let prisma: ReturnType<typeof createPrismaMock>;
  let reflector: jest.Mocked<Pick<Reflector, 'getAllAndOverride'>>;

  const context = {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({
      getRequest: () => ({ user: { id: 1 }, workspaceId: 10 }),
    }),
  } as unknown as ExecutionContext;

  beforeEach(() => {
    prisma = createPrismaMock();
    reflector = { getAllAndOverride: jest.fn() };
    guard = new WorkspaceRoleGuard(
      prisma as unknown as PrismaService,
      reflector as unknown as Reflector,
    );
  });

  it('allows when no roles required', async () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);
    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('allows matching role', async () => {
    reflector.getAllAndOverride.mockReturnValue([
      WorkspaceRole.OWNER,
      WorkspaceRole.ADMIN,
    ]);
    prisma.workspaceMember!.findUnique!.mockResolvedValue({
      role: WorkspaceRole.ADMIN,
    });
    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('forbids missing or wrong role', async () => {
    reflector.getAllAndOverride.mockReturnValue([WorkspaceRole.OWNER]);
    prisma.workspaceMember!.findUnique!.mockResolvedValue({
      role: WorkspaceRole.MEMBER,
    });
    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });
});
