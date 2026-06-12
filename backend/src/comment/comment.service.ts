import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  toUserBrief,
  userBriefWithCharacterSelect,
} from '../common/lib/user-brief';
import { PrismaService } from '../prisma/prisma.service';
import { WorkspaceRole } from '../generated/prisma/enums';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment-dto';
import type { CommentWithUser } from './interface';
import { NotificationService } from '../notification/notification.service';
import { UserNotificationType } from '../generated/prisma/enums';
import { extractMentionedUserIds } from '../workspace/lib/mention-parse';

@Injectable()
export class CommentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async getComments(cardId: number): Promise<CommentWithUser[]> {
    const rows = await this.prisma.comment.findMany({
      where: { cardId },
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: userBriefWithCharacterSelect },
      },
    });
    return rows.map((row) => ({
      ...row,
      user: toUserBrief(row.user),
    }));
  }

  async createComment(
    cardId: number,
    userId: number,
    dto: CreateCommentDto,
  ) {
    const cardCtx = await this.prisma.card.findUnique({
      where: { id: cardId },
      select: {
        id: true,
        title: true,
        list: {
          select: {
            board: {
              select: { id: true, name: true, workspaceId: true },
            },
          },
        },
      },
    });
    if (!cardCtx) {
      throw new NotFoundException({
        code: 'CARD_NOT_FOUND',
        message: 'Card not found',
      });
    }

    const comment = await this.prisma.comment.create({
      data: {
        cardId,
        userId,
        body: dto.body,
      },
      include: {
        user: { select: userBriefWithCharacterSelect },
      },
    });

    const workspaceId = cardCtx.list.board.workspaceId;
    const mentionedIds = extractMentionedUserIds(dto.body).filter(
      (id) => id !== userId,
    );
    if (mentionedIds.length > 0) {
      const members = await this.prisma.workspaceMember.findMany({
        where: {
          workspaceId,
          userId: { in: mentionedIds },
        },
        select: { userId: true },
      });
      const allowed = new Set(members.map((m) => m.userId));
      for (const targetId of mentionedIds) {
        if (!allowed.has(targetId)) continue;
        await this.notificationService.create(
          targetId,
          UserNotificationType.MENTION,
          {
            cardId,
            cardTitle: cardCtx.title,
            boardId: cardCtx.list.board.id,
            boardName: cardCtx.list.board.name,
            workspaceId,
            commentId: comment.id,
            authorUserId: userId,
            authorName: comment.user.name,
          },
        );
      }
    }

    return {
      ...comment,
      user: toUserBrief(comment.user),
    };
  }

  async updateComment(
    commentId: number,
    userId: number,
    dto: UpdateCommentDto,
  ): Promise<CommentWithUser> {
    const comment = await this.getCommentAuthorOrThrow(commentId);
    if (comment.userId !== userId) {
      throw new ForbiddenException({
        code: 'COMMENT_EDIT_FORBIDDEN',
        message: 'You can only edit your own comments.',
      });
    }

    const updated = await this.prisma.comment.update({
      where: { id: commentId },
      data: { body: dto.body },
      include: {
        user: { select: userBriefWithCharacterSelect },
      },
    });
    return {
      ...updated,
      user: toUserBrief(updated.user),
    };
  }

  async deleteComment(
    commentId: number,
    userId: number,
    workspaceId: number,
  ): Promise<{ ok: boolean }> {
    const comment = await this.getCommentAuthorOrThrow(commentId);

    if (comment.userId === userId) {
      await this.prisma.comment.delete({ where: { id: commentId } });
      return { ok: true };
    }

    const member = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
      select: { role: true },
    });

    if (
      member?.role !== WorkspaceRole.OWNER &&
      member?.role !== WorkspaceRole.ADMIN
    ) {
      throw new ForbiddenException({
        code: 'COMMENT_DELETE_FORBIDDEN',
        message:
          'Only workspace owners and administrators can delete comments by other members.',
      });
    }

    await this.prisma.comment.delete({ where: { id: commentId } });
    return { ok: true };
  }

  private async getCommentAuthorOrThrow(
    commentId: number,
  ): Promise<{ userId: number }> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true },
    });

    if (!comment) {
      throw new NotFoundException({
        code: 'COMMENT_NOT_FOUND',
        message: 'Comment not found',
      });
    }

    return comment;
  }
}
