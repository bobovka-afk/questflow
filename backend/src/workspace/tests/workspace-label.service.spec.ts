import { BadRequestException, ConflictException } from '@nestjs/common';
import { WorkspaceLabelService } from '../workspace-label.service';
import { PrismaService } from '../../prisma/prisma.service';
import { createPrismaMock } from '../../testing/prisma-mock';

describe('WorkspaceLabelService', () => {
  let service: WorkspaceLabelService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(() => {
    prisma = createPrismaMock();
    service = new WorkspaceLabelService(prisma as unknown as PrismaService);
  });

  it('lists labels for workspace', async () => {
    prisma.workspaceLabel!.findMany!.mockResolvedValue([]);
    await service.list(10);
    expect(prisma.workspaceLabel!.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { workspaceId: 10 } }),
    );
  });

  it('create throws LABEL_NAME_TAKEN on duplicate', async () => {
    prisma.workspaceLabel!.create!.mockRejectedValue({ code: 'P2002' });
    await expect(
      service.create(10, { name: 'Bug', colorPreset: 'RED' as never }),
    ).rejects.toThrow(ConflictException);
  });

  it('setCardLabels enforces max 6', async () => {
    prisma.card!.findUnique!.mockResolvedValue({
      list: { board: { workspaceId: 10 } },
    });
    await expect(
      service.setCardLabels(1, [1, 2, 3, 4, 5, 6, 7]),
    ).rejects.toThrow(BadRequestException);
  });

  it('setCardLabels replaces card labels in transaction', async () => {
    prisma.card!.findUnique!.mockResolvedValue({
      list: { board: { workspaceId: 10 } },
    });
    prisma.workspaceLabel!.count!.mockResolvedValue(2);
    prisma.$transaction!.mockResolvedValue([]);
    await service.setCardLabels(1, [1, 2]);
    expect(prisma.$transaction).toHaveBeenCalled();
  });

  it('delete returns ok', async () => {
    prisma.workspaceLabel!.delete!.mockResolvedValue({});
    await expect(service.delete(5)).resolves.toEqual({ ok: true });
  });
});
