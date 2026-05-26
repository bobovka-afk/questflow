import { getGameDayBounds } from './game-day';

type XpEventReader = {
  xpEvent: {
    findFirst: (args: {
      where: {
        userId: number;
        createdAt: { gte: Date; lt: Date };
      };
      select: { id: true };
    }) => Promise<{ id: number } | null>;
  };
};

export async function wasUserActiveOnGameDay(
  prisma: XpEventReader,
  userId: number,
  dayKey: Date,
  timeZone: string,
): Promise<boolean> {
  const { start, end } = getGameDayBounds(dayKey, timeZone);
  const event = await prisma.xpEvent.findFirst({
    where: {
      userId,
      createdAt: { gte: start, lt: end },
    },
    select: { id: true },
  });
  return event !== null;
}
