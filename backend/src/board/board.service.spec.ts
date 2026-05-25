import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BoardService } from './board.service';
import { PrismaService } from '../prisma/prisma.service';
import { createPrismaMock } from '../testing/prisma-mock';

describe('BoardService', () => {
  let service: BoardService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(() => {
    prisma = createPrismaMock();
    service = new BoardService(prisma as unknown as PrismaService);
  });

  it('getBoard throws when missing', async () => {
    prisma.board!.findUnique!.mockResolvedValue(null);
    await expect(service.getBoard(1)).rejects.toThrow(NotFoundException);
  });

  it('updateBoard requires fields', async () => {
    await expect(service.updateBoard(1, {})).rejects.toThrow(
      BadRequestException,
    );
  });

  it('deleteBoard returns ok', async () => {
    prisma.board!.delete!.mockResolvedValue({});
    await expect(service.deleteBoard(1)).resolves.toEqual({ ok: true });
  });

  it('createBoard delegates to prisma', async () => {
    prisma.board!.create!.mockResolvedValue({ id: 1, name: 'B' });
    await service.createBoard(10, { name: 'B', position: 0 });
    expect(prisma.board!.create).toHaveBeenCalled();
  });

  it('getBoards returns boards', async () => {
    prisma.board!.findMany!.mockResolvedValue([]);
    await service.getBoards(10);
    expect(prisma.board!.findMany).toHaveBeenCalled();
  });
});
