import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment-dto';
import type { CommentWithUser } from './interface';
import type { AuthedRequest, WorkspaceAuthedRequest } from '../common/type';
export declare class CommentController {
    private readonly commentService;
    constructor(commentService: CommentService);
    getComments(cardId: number): Promise<CommentWithUser[]>;
    createComment(cardId: number, dto: CreateCommentDto, req: AuthedRequest): Promise<CommentWithUser>;
    updateComment(commentId: number, dto: UpdateCommentDto, req: AuthedRequest): Promise<CommentWithUser>;
    deleteComment(commentId: number, req: WorkspaceAuthedRequest): Promise<{
        ok: boolean;
    }>;
}
