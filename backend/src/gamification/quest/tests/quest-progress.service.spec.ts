import { createPrismaMock } from '../../../testing/prisma-mock';
import { QuestProgressService } from '../quest-progress.service';
import { ChestService } from '../../chest/chest.service';
import { QuestMetric, QuestPeriod, ChestTier } from '../../../generated/prisma/enums';

describe('QuestProgressService', () => {
  const prisma = createPrismaMock();
  const configService = { get: jest.fn(() => 'UTC') };
  const achievementService = {
    recordIncrement: jest.fn().mockResolvedValue([]),
  };
  const chestService = new ChestService(
    prisma as never,
    achievementService as never,
  );
  let service: QuestProgressService;

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.questTemplate = {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    };
    prisma.userQuestProgress = {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      upsert: jest.fn(),
      count: jest.fn(),
    };
    prisma.character = { findUnique: jest.fn() };
    prisma.userWorkspaceQuestDay = { upsert: jest.fn(), findMany: jest.fn() };
    prisma.userQuestXpDay = { upsert: jest.fn(), count: jest.fn() };
    prisma.userChest = { findUnique: jest.fn(), create: jest.fn() };
    prisma.$transaction = jest.fn((fn: (tx: unknown) => unknown) =>
      fn(prisma),
    );
    service = new QuestProgressService(
      prisma as never,
      configService as never,
      chestService,
      achievementService as never,
    );
  });

  it('skips card quest when no character', async () => {
    prisma.character!.findUnique!.mockResolvedValue(null);
    const result = await service.recordCardCompleted(1, {
      cardId: 1,
      workspaceId: 2,
      dueDate: null,
    });
    expect(result).toEqual([]);
  });

  it('increments CARDS_COMPLETED daily template', async () => {
    prisma.character!.findUnique!.mockResolvedValue({ id: 1 });
    prisma.userWorkspaceQuestDay!.upsert!.mockResolvedValue({});
    prisma.questTemplate!.findMany!.mockResolvedValue([
      {
        id: 1,
        period: QuestPeriod.DAILY,
        metric: QuestMetric.CARDS_COMPLETED,
        target: 3,
        rewardChestTier: ChestTier.COMMON,
        key: 'daily_cards_3',
        titleRu: 'Test',
      },
    ]);
    prisma.userQuestProgress!.findUnique!.mockResolvedValue(null);
    prisma.userQuestProgress!.upsert!.mockResolvedValue({});
    prisma.userChest!.findUnique!.mockResolvedValue(null);
    prisma.userChest!.create!.mockResolvedValue({ id: 10 });
    prisma.questTemplate!.findFirst!.mockResolvedValue(null);
    prisma.userWorkspaceQuestDay!.findMany!.mockResolvedValue([]);

    const result = await service.recordCardCompleted(1, {
      cardId: 5,
      workspaceId: 2,
      dueDate: null,
    });

    expect(prisma.userQuestProgress!.upsert).toHaveBeenCalled();
    expect(result).toHaveLength(0);
  });
});
