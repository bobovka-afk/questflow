import type { Prisma } from '../../generated/prisma/client';

export async function nextWorkspaceMemberSortOrder(
  tx: Prisma.TransactionClient,
  userId: number,
): Promise<number> {
  const agg = await tx.workspaceMember.aggregate({
    where: { userId },
    _max: { sortOrder: true },
  });
  return (agg._max.sortOrder ?? -1) + 1;
}
