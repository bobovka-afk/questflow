import { NotFoundException } from '@nestjs/common';
import { WorkspaceContextResolver } from './workspace-context.resolver';
import { PrismaService } from '../../prisma/prisma.service';
import { createPrismaMock } from '../../testing/prisma-mock';

describe('WorkspaceContextResolver', () => {
  let resolver: WorkspaceContextResolver;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(() => {
    prisma = createPrismaMock();
    resolver = new WorkspaceContextResolver(
      prisma as unknown as PrismaService,
    );
  });

  it('byWorkspaceIdOrThrow returns id', async () => {
    prisma.workspace!.findUnique!.mockResolvedValue({ id: 5 });
    await expect(resolver.byWorkspaceIdOrThrow(5)).resolves.toBe(5);
  });

  it('byWorkspaceIdOrThrow throws when missing', async () => {
    prisma.workspace!.findUnique!.mockResolvedValue(null);
    await expect(resolver.byWorkspaceIdOrThrow(5)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('byBoardIdOrThrow resolves workspace', async () => {
    prisma.board!.findUnique!.mockResolvedValue({ workspaceId: 7 });
    await expect(resolver.byBoardIdOrThrow(1)).resolves.toBe(7);
  });

  it('byListIdOrThrow resolves workspace', async () => {
    prisma.list!.findUnique!.mockResolvedValue({
      board: { workspaceId: 8 },
    });
    await expect(resolver.byListIdOrThrow(2)).resolves.toBe(8);
  });

  it('byCardIdOrThrow resolves workspace', async () => {
    prisma.card!.findUnique!.mockResolvedValue({
      list: { board: { workspaceId: 9 } },
    });
    await expect(resolver.byCardIdOrThrow(3)).resolves.toBe(9);
  });

  it('byCommentIdOrThrow resolves workspace', async () => {
    prisma.comment!.findUnique!.mockResolvedValue({
      card: { list: { board: { workspaceId: 11 } } },
    });
    await expect(resolver.byCommentIdOrThrow(4)).resolves.toBe(11);
  });

  it('byBoardIdOrThrow throws when board missing', async () => {
    prisma.board!.findUnique!.mockResolvedValue(null);
    await expect(resolver.byBoardIdOrThrow(1)).rejects.toThrow(NotFoundException);
  });

  it('byListIdOrThrow throws when list missing', async () => {
    prisma.list!.findUnique!.mockResolvedValue(null);
    await expect(resolver.byListIdOrThrow(2)).rejects.toThrow(NotFoundException);
  });
});
