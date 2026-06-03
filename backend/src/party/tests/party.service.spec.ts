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
    service = new PartyService(
      prisma as unknown as PrismaService,
      chestService as unknown as ChestService,
    );
  });

  describe('createRaid', () => {
    it('rejects non-friends', async () => {
      prisma.partyRaidMember!.findFirst!.mockResolvedValue(null);
      prisma.friendRequest!.findFirst!.mockResolvedValue(null);
      await expect(service.createRaid(1, 'nasadka', [2])).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
