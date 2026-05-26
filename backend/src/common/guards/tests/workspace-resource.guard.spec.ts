import {
  BadRequestException,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { WorkspaceResourceGuard } from '../workspace-resource.guard';
import { WorkspaceContextResolver } from '../../services/workspace-context.resolver';

describe('WorkspaceResourceGuard', () => {
  let guard: WorkspaceResourceGuard;
  let resolver: jest.Mocked<
    Pick<
      WorkspaceContextResolver,
      'byListIdOrThrow' | 'byBoardIdOrThrow' | 'byCardIdOrThrow' | 'byCommentIdOrThrow'
    >
  >;

  const makeContext = (params: Record<string, string>, workspaceId = 10) =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ params, workspaceId }),
      }),
    }) as unknown as ExecutionContext;

  beforeEach(() => {
    resolver = {
      byListIdOrThrow: jest.fn().mockResolvedValue(10),
      byBoardIdOrThrow: jest.fn().mockResolvedValue(10),
      byCardIdOrThrow: jest.fn().mockResolvedValue(10),
      byCommentIdOrThrow: jest.fn().mockResolvedValue(10),
    };
    guard = new WorkspaceResourceGuard(
      resolver as unknown as WorkspaceContextResolver,
    );
  });

  it('allows when no resource params', async () => {
    await expect(guard.canActivate(makeContext({}))).resolves.toBe(true);
  });

  it('allows matching workspace from listId', async () => {
    await expect(
      guard.canActivate(makeContext({ listId: '3' })),
    ).resolves.toBe(true);
    expect(resolver.byListIdOrThrow).toHaveBeenCalledWith(3);
  });

  it('forbids workspace mismatch', async () => {
    resolver.byCardIdOrThrow.mockResolvedValue(99);
    await expect(
      guard.canActivate(makeContext({ cardId: '1' })),
    ).rejects.toThrow(ForbiddenException);
  });

  it('rejects invalid listId', async () => {
    await expect(
      guard.canActivate(makeContext({ listId: 'x' })),
    ).rejects.toThrow(BadRequestException);
  });

  it('resolves boardId param', async () => {
    await expect(
      guard.canActivate(makeContext({ boardId: '4' })),
    ).resolves.toBe(true);
    expect(resolver.byBoardIdOrThrow).toHaveBeenCalledWith(4);
  });

  it('rejects invalid cardId', async () => {
    await expect(
      guard.canActivate(makeContext({ cardId: 'bad' })),
    ).rejects.toThrow(BadRequestException);
  });

  it('resolves cardId param', async () => {
    await expect(
      guard.canActivate(makeContext({ cardId: '7' })),
    ).resolves.toBe(true);
    expect(resolver.byCardIdOrThrow).toHaveBeenCalledWith(7);
  });
});
