import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ListService } from './list.service';
import { PrismaService } from '../prisma/prisma.service';
import { createPrismaMock } from '../testing/prisma-mock';

describe('ListService', () => {
  let service: ListService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(() => {
    prisma = createPrismaMock();
    service = new ListService(prisma as unknown as PrismaService);
  });

  it('getLists and createList call prisma', async () => {
    prisma.list!.findMany!.mockResolvedValue([]);
    await service.getLists(1);
    prisma.list!.create!.mockResolvedValue({ id: 1 });
    await service.createList(1, { name: 'Todo', position: 0 });
    expect(prisma.list!.create).toHaveBeenCalled();
  });

  it('updateList requires fields', async () => {
    await expect(service.updateList(1, {})).rejects.toThrow(BadRequestException);
  });

  it('moveList throws when list missing', async () => {
    const tx = {
      list: {
        findUnique: jest.fn().mockResolvedValue(null),
        findMany: jest.fn(),
        update: jest.fn(),
      },
    };
    prisma.$transaction!.mockImplementation(async (fn) => fn(tx as never));
    await expect(service.moveList(1, { position: 0 })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('moveList reorders lists', async () => {
    const tx = {
      list: {
        findUnique: jest.fn().mockResolvedValue({ id: 2, boardId: 1 }),
        findMany: jest
          .fn()
          .mockResolvedValue([{ id: 1 }, { id: 2 }, { id: 3 }]),
        update: jest.fn(),
      },
    };
    prisma.$transaction!.mockImplementation(async (fn) => fn(tx as never));
    tx.list.findUnique
      .mockResolvedValueOnce({ id: 2, boardId: 1 })
      .mockResolvedValueOnce({ id: 2, name: 'L' });
    await service.moveList(2, { position: 0 });
    expect(tx.list.update).toHaveBeenCalled();
  });
});
