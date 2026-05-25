import { wasUserActiveOnGameDay } from './inactivity';
import { getGameDayBounds } from './game-day';

describe('inactivity', () => {
  describe('wasUserActiveOnGameDay', () => {
    it('returns true when xp event exists in day bounds', async () => {
      const prisma = {
        xpEvent: {
          findFirst: jest.fn().mockResolvedValue({ id: 1 }),
        },
      };
      const dayKey = new Date('2026-05-24T00:00:00.000Z');

      await expect(
        wasUserActiveOnGameDay(prisma as never, 7, dayKey, 'UTC'),
      ).resolves.toBe(true);

      const { start, end } = getGameDayBounds(dayKey, 'UTC');
      expect(prisma.xpEvent.findFirst).toHaveBeenCalledWith({
        where: {
          userId: 7,
          createdAt: { gte: start, lt: end },
        },
        select: { id: true },
      });
    });

    it('returns false when no xp events', async () => {
      const prisma = {
        xpEvent: {
          findFirst: jest.fn().mockResolvedValue(null),
        },
      };

      await expect(
        wasUserActiveOnGameDay(
          prisma as never,
          7,
          new Date('2026-05-24T00:00:00.000Z'),
          'UTC',
        ),
      ).resolves.toBe(false);
    });
  });
});
