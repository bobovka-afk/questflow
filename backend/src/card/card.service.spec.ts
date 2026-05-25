import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { XpEventType } from '../generated/prisma/enums';
import { CardService } from './card.service';
import { CharacterService } from '../character/character.service';
import { PrismaService } from '../prisma/prisma.service';
import { createPrismaMock } from '../testing/prisma-mock';
import { XP_PER_TASK_COMPLETED } from '../gamification/config/rewards';

describe('CardService', () => {
  let service: CardService;
  let prisma: ReturnType<typeof createPrismaMock>;
  let characterService: jest.Mocked<Pick<CharacterService, 'addExperience'>>;

  beforeEach(() => {
    prisma = createPrismaMock();
    characterService = { addExperience: jest.fn() };
    service = new CardService(
      prisma as unknown as PrismaService,
      characterService as unknown as CharacterService,
    );
  });

  describe('updateCard', () => {
    it('requires at least one field', async () => {
      await expect(service.updateCard(1, {})).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('setCardCompletion', () => {
    it('throws when card missing', async () => {
      prisma.card!.findUnique!.mockResolvedValue(null);
      await expect(
        service.setCardCompletion(1, { isCompleted: true }, 10),
      ).rejects.toThrow(NotFoundException);
    });

    it('grants XP when completing assigned card', async () => {
      prisma.card!.findUnique!.mockResolvedValue({
        assigneeId: 5,
        isCompleted: false,
      });
      prisma.card!.update!.mockResolvedValue({});
      characterService.addExperience.mockResolvedValue({} as never);

      await service.setCardCompletion(1, { isCompleted: true }, 10);

      expect(characterService.addExperience).toHaveBeenCalledWith(
        5,
        XP_PER_TASK_COMPLETED,
        XpEventType.TASK_COMPLETED,
        1,
      );
    });

    it('uses actor when no assignee', async () => {
      prisma.card!.findUnique!.mockResolvedValue({
        assigneeId: null,
        isCompleted: false,
      });
      prisma.card!.update!.mockResolvedValue({});

      await service.setCardCompletion(2, { isCompleted: true }, 10);

      expect(characterService.addExperience).toHaveBeenCalledWith(
        10,
        XP_PER_TASK_COMPLETED,
        XpEventType.TASK_COMPLETED,
        2,
      );
    });

    it('does not grant XP when uncompleting', async () => {
      prisma.card!.findUnique!.mockResolvedValue({
        assigneeId: 5,
        isCompleted: true,
      });
      prisma.card!.update!.mockResolvedValue({});

      await service.setCardCompletion(1, { isCompleted: false }, 10);

      expect(characterService.addExperience).not.toHaveBeenCalled();
    });
  });

  describe('moveCard', () => {
    const tx = {
      card: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
      list: { findUnique: jest.fn() },
    };

    beforeEach(() => {
      prisma.$transaction!.mockImplementation(async (fn) => fn(tx as never));
    });

    it('throws when card missing', async () => {
      tx.card.findUnique.mockResolvedValue(null);
      await expect(
        service.moveCard(1, { toListId: 2, position: 0 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('rejects cross-board move', async () => {
      tx.card.findUnique.mockResolvedValue({
        id: 1,
        listId: 1,
        list: { boardId: 10 },
      });
      tx.list.findUnique.mockResolvedValue({ id: 2, boardId: 99 });
      await expect(
        service.moveCard(1, { toListId: 2, position: 0 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('moves card to another list on same board', async () => {
      tx.card.findUnique
        .mockResolvedValueOnce({
          id: 2,
          listId: 1,
          list: { boardId: 10 },
        })
        .mockResolvedValueOnce({ id: 2 });
      tx.list.findUnique.mockResolvedValue({ id: 3, boardId: 10 });
      tx.card.findMany
        .mockResolvedValueOnce([{ id: 1 }, { id: 2 }])
        .mockResolvedValueOnce([{ id: 3 }]);
      tx.card.update.mockResolvedValue({});

      await service.moveCard(2, { toListId: 3, position: 0 });

      expect(tx.card.update).toHaveBeenCalled();
    });

    it('reorders card within same list', async () => {
      tx.card.findUnique.mockResolvedValue({
        id: 2,
        listId: 1,
        list: { boardId: 10 },
      });
      tx.list.findUnique.mockResolvedValue({ id: 1, boardId: 10 });
      tx.card.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }, { id: 3 }]);
      tx.card.update.mockResolvedValue({});
      tx.card.findUnique.mockResolvedValueOnce({
        id: 2,
        listId: 1,
        list: { boardId: 10 },
      });
      tx.card.findUnique.mockResolvedValueOnce({ id: 2 });

      await service.moveCard(2, { toListId: 1, position: 0 });

      expect(tx.card.update).toHaveBeenCalled();
    });
  });

  it('getCards returns ordered cards', async () => {
    prisma.card!.findMany!.mockResolvedValue([]);
    await service.getCards(1);
    expect(prisma.card!.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { listId: 1 } }),
    );
  });

  it('deleteCard returns ok', async () => {
    prisma.card!.delete!.mockResolvedValue({});
    await expect(service.deleteCard(1)).resolves.toEqual({ ok: true });
  });
});
