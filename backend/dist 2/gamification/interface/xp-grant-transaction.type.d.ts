import type { Prisma } from '../../generated/prisma/client';
export type XpGrantTransaction = Pick<Prisma.TransactionClient, 'character' | 'xpEvent'>;
