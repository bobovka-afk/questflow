import {
  BadRequestException,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { WorkspaceAccessGuard } from './workspace-access.guard';
import { PrismaService } from '../../prisma/prisma.service';
import { createPrismaMock } from '../../testing/prisma-mock';

describe('WorkspaceAccessGuard', () => {
  let guard: WorkspaceAccessGuard;
  let prisma: ReturnType<typeof createPrismaMock>;

  const context = (params: Record<string, string>, userId?: number) =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ user: userId ? { id: userId } : undefined, params }),
      }),
    }) as unknown as ExecutionContext;

  beforeEach(() => {
    prisma = createPrismaMock();
    guard = new WorkspaceAccessGuard(prisma as unknown as PrismaService);
  });

  it('requires authenticated user', async () => {
    await expect(
      guard.canActivate(context({ workspaceId: '1' })),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('requires valid workspaceId', async () => {
    await expect(
      guard.canActivate(context({ workspaceId: 'x' }, 1)),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws when workspace missing', async () => {
    prisma.workspace!.findUnique!.mockResolvedValue(null);
    await expect(
      guard.canActivate(context({ workspaceId: '1' }, 1)),
    ).rejects.toThrow(NotFoundException);
  });

  it('forbids non-members', async () => {
    prisma.workspace!.findUnique!.mockResolvedValue({ id: 1 });
    prisma.workspaceMember!.findUnique!.mockResolvedValue(null);
    await expect(
      guard.canActivate(context({ workspaceId: '1' }, 1)),
    ).rejects.toThrow(ForbiddenException);
  });

  it('sets workspaceId on request for members', async () => {
    prisma.workspace!.findUnique!.mockResolvedValue({ id: 1 });
    prisma.workspaceMember!.findUnique!.mockResolvedValue({ userId: 1 });
    const req: { workspaceId?: number; user?: { id: number }; params: Record<string, string> } = {
      user: { id: 1 },
      params: { workspaceId: '1' },
    };
    const ctx = {
      switchToHttp: () => ({ getRequest: () => req }),
    } as unknown as ExecutionContext;
    await expect(guard.canActivate(ctx)).resolves.toBe(true);
    expect(req.workspaceId).toBe(1);
  });
});
