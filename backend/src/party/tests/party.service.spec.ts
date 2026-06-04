import { ForbiddenException } from '@nestjs/common';
import { ChestService } from '../../gamification/chest/chest.service';
import { PrismaService } from '../../prisma/prisma.service';
import { createPrismaMock } from '../../testing/prisma-mock';
import { PartyService } from '../party.service';

describe('PartyService', () => {
  let service: PartyService;
  let prisma: ReturnType<typeof createPrismaMock>;
  let chestService: { grantChest: jest.Mock };

  beforeEach(() => {
    prisma = createPrismaMock();
    chestService = { grantChest: jest.fn().mockResolvedValue({ chestId: 1, created: true }) };
    const notificationService = { create: jest.fn().mockResolvedValue(undefined) };
    const userBlockService = { assertNotBlocked: jest.fn().mockResolvedValue(undefined) };
    service = new PartyService(
      prisma as unknown as PrismaService,
      chestService as unknown as ChestService,
      notificationService as never,
      userBlockService as never,
    );
  });

  describe('createRaid', () => {
    it('rejects non-friends', async () => {
      prisma.partyRaidMember!.count!.mockResolvedValue(0);
      prisma.partyRaidMember!.findFirst!.mockResolvedValue(null);
      prisma.friendRequest!.findFirst!.mockResolvedValue(null);
      await expect(service.createRaid(1, 'nasadka', [2])).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
