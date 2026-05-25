import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment-dto';
import type { CommentWithUser } from './interface';
export declare class CommentService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getComments(cardId: number): Promise<CommentWithUser[]>;
    createComment(cardId: number, userId: number, dto: CreateCommentDto): Promise<{
        user: {
            id: number;
            name: string;
            avatarPath: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        cardId: number;
        body: string;
    }>;
    updateComment(commentId: number, userId: number, dto: UpdateCommentDto): Promise<CommentWithUser>;
    deleteComment(commentId: number, userId: number, workspaceId: number): Promise<{
        ok: boolean;
    }>;
    private getCommentAuthorOrThrow;
}
