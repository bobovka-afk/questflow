"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const enums_1 = require("../generated/prisma/enums");
let CommentService = class CommentService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getComments(cardId) {
        return this.prisma.comment.findMany({
            where: { cardId },
            orderBy: { createdAt: 'asc' },
            include: {
                user: {
                    select: { id: true, name: true, avatarPath: true },
                },
            },
        });
    }
    async createComment(cardId, userId, dto) {
        return this.prisma.comment.create({
            data: {
                cardId,
                userId,
                body: dto.body,
            },
            include: {
                user: {
                    select: { id: true, name: true, avatarPath: true },
                },
            },
        });
    }
    async updateComment(commentId, userId, dto) {
        const comment = await this.getCommentAuthorOrThrow(commentId);
        if (comment.userId !== userId) {
            throw new common_1.ForbiddenException({
                code: 'COMMENT_EDIT_FORBIDDEN',
                message: 'You can only edit your own comments.',
            });
        }
        return this.prisma.comment.update({
            where: { id: commentId },
            data: { body: dto.body },
            include: {
                user: {
                    select: { id: true, name: true, avatarPath: true },
                },
            },
        });
    }
    async deleteComment(commentId, userId, workspaceId) {
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
        if (member?.role !== enums_1.WorkspaceRole.OWNER &&
            member?.role !== enums_1.WorkspaceRole.ADMIN) {
            throw new common_1.ForbiddenException({
                code: 'COMMENT_DELETE_FORBIDDEN',
                message: 'Only workspace owners and administrators can delete comments by other members.',
            });
        }
        await this.prisma.comment.delete({ where: { id: commentId } });
        return { ok: true };
    }
    async getCommentAuthorOrThrow(commentId) {
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId },
            select: { userId: true },
        });
        if (!comment) {
            throw new common_1.NotFoundException({
                code: 'COMMENT_NOT_FOUND',
                message: 'Comment not found',
            });
        }
        return comment;
    }
};
exports.CommentService = CommentService;
exports.CommentService = CommentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommentService);
//# sourceMappingURL=comment.service.js.map