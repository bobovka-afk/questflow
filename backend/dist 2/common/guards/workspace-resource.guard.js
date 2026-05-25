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
exports.WorkspaceResourceGuard = void 0;
const common_1 = require("@nestjs/common");
const workspace_context_resolver_1 = require("../services/workspace-context.resolver");
let WorkspaceResourceGuard = class WorkspaceResourceGuard {
    workspaceContextResolver;
    constructor(workspaceContextResolver) {
        this.workspaceContextResolver = workspaceContextResolver;
    }
    async canActivate(context) {
        const req = context
            .switchToHttp()
            .getRequest();
        const workspaceId = req.workspaceId;
        const params = req.params ?? {};
        const resolvedWorkspaceId = await this.resolveWorkspaceIdFromParams(params);
        if (resolvedWorkspaceId === null) {
            return true;
        }
        if (resolvedWorkspaceId !== workspaceId) {
            throw new common_1.ForbiddenException({
                code: 'RESOURCE_WORKSPACE_MISMATCH',
                message: 'Resource does not belong to this workspace',
            });
        }
        return true;
    }
    async resolveWorkspaceIdFromParams(params) {
        if (params.listId !== undefined) {
            const listId = Number(params.listId);
            if (!Number.isInteger(listId)) {
                throw new common_1.BadRequestException({
                    code: 'LIST_ID_REQUIRED',
                    message: 'listId route param is required',
                });
            }
            return this.workspaceContextResolver.byListIdOrThrow(listId);
        }
        if (params.boardId !== undefined) {
            const boardId = Number(params.boardId);
            if (!Number.isInteger(boardId)) {
                throw new common_1.BadRequestException({
                    code: 'BOARD_ID_REQUIRED',
                    message: 'boardId route param is required',
                });
            }
            return this.workspaceContextResolver.byBoardIdOrThrow(boardId);
        }
        if (params.cardId !== undefined) {
            const cardId = Number(params.cardId);
            if (!Number.isInteger(cardId)) {
                throw new common_1.BadRequestException({
                    code: 'CARD_ID_REQUIRED',
                    message: 'cardId route param is required',
                });
            }
            return this.workspaceContextResolver.byCardIdOrThrow(cardId);
        }
        if (params.commentId !== undefined) {
            const commentId = Number(params.commentId);
            if (!Number.isInteger(commentId)) {
                throw new common_1.BadRequestException({
                    code: 'COMMENT_ID_REQUIRED',
                    message: 'commentId route param is required',
                });
            }
            return this.workspaceContextResolver.byCommentIdOrThrow(commentId);
        }
        return null;
    }
};
exports.WorkspaceResourceGuard = WorkspaceResourceGuard;
exports.WorkspaceResourceGuard = WorkspaceResourceGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [workspace_context_resolver_1.WorkspaceContextResolver])
], WorkspaceResourceGuard);
//# sourceMappingURL=workspace-resource.guard.js.map