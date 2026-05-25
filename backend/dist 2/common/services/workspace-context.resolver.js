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
exports.WorkspaceContextResolver = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let WorkspaceContextResolver = class WorkspaceContextResolver {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async byWorkspaceIdOrThrow(workspaceId) {
        const workspace = await this.prisma.workspace.findUnique({
            where: { id: workspaceId },
            select: { id: true },
        });
        if (!workspace) {
            throw new common_1.NotFoundException({
                code: 'WORKSPACE_NOT_FOUND',
                message: 'Workspace not found',
            });
        }
        return workspace.id;
    }
    async byBoardIdOrThrow(boardId) {
        const board = await this.prisma.board.findUnique({
            where: { id: boardId },
            select: { workspaceId: true },
        });
        if (!board) {
            throw new common_1.NotFoundException({
                code: 'BOARD_NOT_FOUND',
                message: 'Board not found',
            });
        }
        return board.workspaceId;
    }
    async byListIdOrThrow(listId) {
        const list = await this.prisma.list.findUnique({
            where: { id: listId },
            select: {
                board: {
                    select: { workspaceId: true },
                },
            },
        });
        if (!list) {
            throw new common_1.NotFoundException({
                code: 'LIST_NOT_FOUND',
                message: 'List not found',
            });
        }
        return list.board.workspaceId;
    }
    async byCardIdOrThrow(cardId) {
        const card = await this.prisma.card.findUnique({
            where: { id: cardId },
            select: {
                list: {
                    select: {
                        board: { select: { workspaceId: true } },
                    },
                },
            },
        });
        if (!card) {
            throw new common_1.NotFoundException({
                code: 'CARD_NOT_FOUND',
                message: 'Card not found',
            });
        }
        return card.list.board.workspaceId;
    }
    async byCommentIdOrThrow(commentId) {
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId },
            select: {
                card: {
                    select: {
                        list: {
                            select: {
                                board: { select: { workspaceId: true } },
                            },
                        },
                    },
                },
            },
        });
        if (!comment) {
            throw new common_1.NotFoundException({
                code: 'COMMENT_NOT_FOUND',
                message: 'Comment not found',
            });
        }
        return comment.card.list.board.workspaceId;
    }
};
exports.WorkspaceContextResolver = WorkspaceContextResolver;
exports.WorkspaceContextResolver = WorkspaceContextResolver = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorkspaceContextResolver);
//# sourceMappingURL=workspace-context.resolver.js.map