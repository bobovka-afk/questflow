import { PrismaService } from '../../prisma/prisma.service';
export declare class WorkspaceContextResolver {
    private readonly prisma;
    constructor(prisma: PrismaService);
    byWorkspaceIdOrThrow(workspaceId: number): Promise<number>;
    byBoardIdOrThrow(boardId: number): Promise<number>;
    byListIdOrThrow(listId: number): Promise<number>;
    byCardIdOrThrow(cardId: number): Promise<number>;
    byCommentIdOrThrow(commentId: number): Promise<number>;
}
