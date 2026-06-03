import { NotificationService } from '../notification.service';
import { PrismaService } from '../../prisma/prisma.service';
import { createPrismaMock } from '../../testing/prisma-mock';
import { UserNotificationType } from '../../generated/prisma/enums';

describe('NotificationService', () => {
  let service: NotificationService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(() => {
    prisma = createPrismaMock();
    service = new NotificationService(prisma as unknown as PrismaService);
  });

  it('create inserts notification', async () => {
    prisma.userNotification!.create!.mockResolvedValue({ id: 1 });
    await service.create(5, UserNotificationType.MENTION, { cardId: 1 });
    expect(prisma.userNotification!.create).toHaveBeenCalled();
  });

  it('unreadCount queries unread', async () => {
    prisma.userNotification!.count!.mockResolvedValue(3);
    await expect(service.unreadCount(5)).resolves.toBe(3);
  });

  it('markAllRead updates unread rows', async () => {
    prisma.userNotification!.updateMany!.mockResolvedValue({ count: 2 });
    await service.markAllRead(5);
    expect(prisma.userNotification!.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 5, readAt: null } }),
    );
  });
});
