import type { PrismaClient } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { WorkspaceActivityType } from '../generated/prisma/enums';
import { Prisma } from '../generated/prisma/client';
import { PaginationDto } from '../workspace/dto/pagination.dto';
import type { WorkspaceActivityListItem } from './interface';
export declare class WorkspaceActivityService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    record(db: Pick<PrismaClient, 'workspaceActivity'>, input: {
        workspaceId: number;
        actorUserId: number;
        type: WorkspaceActivityType;
        payload: Prisma.InputJsonValue;
    }): Promise<void>;
    listByWorkspace(workspaceId: number, pagination: PaginationDto): Promise<WorkspaceActivityListItem[]>;
}
