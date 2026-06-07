import {
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { WorkspaceRole } from '../../generated/prisma/enums';
import { CommentService } from '../comment.service';
import { PrismaService } from '../../prisma/prisma.service';
import { createPrismaMock } from '../../testing/prisma-mock';

describe('CommentService', () => {
  let service: CommentService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(() => {
    prisma = createPrismaMock();
    const questProgressService = {
      recordCommentCreated: jest.fn().mockResolvedValue([]),
    };
    const notificationService = {
      create: jest.fn().mockResolvedValue(undefined),
    };
    service = new CommentService(
      prisma as unknown as PrismaService,
      questProgressService as never,
      notificationService as never,
    );
  });

  it('getComments and createComment', async () => {
    prisma.comment!.findMany!.mockResolvedValue([]);
    await service.getComments(1);
    prisma.card!.findUnique!.mockResolvedValue({
      id: 1,
      title: 'T',
      list: { board: { id: 2, name: 'B', workspaceId: 10 } },
    });
    prisma.comment!.create!.mockResolvedValue({
      id: 1,
      body: 'hi',
      user: { id: 2, name: 'A', avatarPath: null },
    });
    await service.createComment(1, 2, { body: 'hi' });
    expect(prisma.comment!.create).toHaveBeenCalled();
  });

  it('updateComment forbids other users', async () => {
    prisma.comment!.findUnique!.mockResolvedValue({ userId: 2 });
    await expect(
      service.updateComment(1, 1, { body: 'x' }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('updateComment updates own comment', async () => {
    prisma.comment!.findUnique!.mockResolvedValue({ userId: 1 });
    prisma.comment!.update!.mockResolvedValue({ id: 1, body: 'x' });
    await service.updateComment(1, 1, { body: 'x' });
    expect(prisma.comment!.update).toHaveBeenCalled();
  });

  it('deleteComment allows author', async () => {
    prisma.comment!.findUnique!.mockResolvedValue({ userId: 1 });
    prisma.comment!.delete!.mockResolvedValue({});
    await expect(
      service.deleteComment(1, 1, 10),
    ).resolves.toEqual({ ok: true });
  });

  it('deleteComment requires admin for others', async () => {
    prisma.comment!.findUnique!.mockResolvedValue({ userId: 2 });
    prisma.workspaceMember!.findUnique!.mockResolvedValue({
      role: WorkspaceRole.MEMBER,
    });
    await expect(
      service.deleteComment(1, 1, 10),
    ).rejects.toThrow(ForbiddenException);
  });

  it('deleteComment throws when comment missing', async () => {
    prisma.comment!.findUnique!.mockResolvedValue(null);
    await expect(
      service.deleteComment(1, 1, 10),
    ).rejects.toThrow(NotFoundException);
  });
});
