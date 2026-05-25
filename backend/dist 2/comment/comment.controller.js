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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
const common_1 = require("@nestjs/common");
const comment_service_1 = require("./comment.service");
const auth_guard_1 = require("../auth/guards/auth.guard");
const workspace_access_guard_1 = require("../common/guards/workspace-access.guard");
const workspace_resource_guard_1 = require("../common/guards/workspace-resource.guard");
const create_comment_dto_1 = require("./dto/create-comment.dto");
const update_comment_dto_1 = require("./dto/update-comment-dto");
const rate_limit_decorator_1 = require("../common/decorators/rate-limit.decorator");
const rate_limit_guard_1 = require("../common/guards/rate-limit.guard");
const swagger_1 = require("@nestjs/swagger");
let CommentController = class CommentController {
    commentService;
    constructor(commentService) {
        this.commentService = commentService;
    }
    async getComments(cardId) {
        return this.commentService.getComments(cardId);
    }
    async createComment(cardId, dto, req) {
        return this.commentService.createComment(cardId, req.user.id, dto);
    }
    async updateComment(commentId, dto, req) {
        return this.commentService.updateComment(commentId, req.user.id, dto);
    }
    async deleteComment(commentId, req) {
        return this.commentService.deleteComment(commentId, req.user.id, req.workspaceId);
    }
};
exports.CommentController = CommentController;
__decorate([
    (0, common_1.Get)('cards/:cardId/comments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get comments for a card' }),
    (0, swagger_1.ApiParam)({ name: 'workspaceId', example: 1, description: 'Workspace id' }),
    (0, swagger_1.ApiParam)({ name: 'cardId', example: 35, description: 'Card id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Comments returned successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'WORKSPACE_ACTION_FORBIDDEN' | code: 'RESOURCE_WORKSPACE_MISMATCH'" }),
    __param(0, (0, common_1.Param)('cardId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "getComments", null);
__decorate([
    (0, common_1.Post)('cards/:cardId/comments'),
    (0, common_1.UseGuards)(rate_limit_guard_1.RateLimitGuard),
    (0, rate_limit_decorator_1.RateLimit)({ key: 'comment:create', limit: 20, windowSec: 60 }),
    (0, swagger_1.ApiOperation)({ summary: 'Create comment for a card' }),
    (0, swagger_1.ApiBody)({ type: create_comment_dto_1.CreateCommentDto, description: 'Comment creation payload' }),
    (0, swagger_1.ApiParam)({ name: 'workspaceId', example: 1, description: 'Workspace id' }),
    (0, swagger_1.ApiParam)({ name: 'cardId', example: 35, description: 'Card id' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Comment created successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "code: 'CARD_ID_REQUIRED' | code: 'WORKSPACE_ID_REQUIRED'" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 429, description: "code: 'RATE_LIMIT_EXCEEDED'" }),
    __param(0, (0, common_1.Param)('cardId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_comment_dto_1.CreateCommentDto, Object]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "createComment", null);
__decorate([
    (0, common_1.Patch)('comments/:commentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update comment' }),
    (0, swagger_1.ApiBody)({ type: update_comment_dto_1.UpdateCommentDto, description: 'Comment update payload' }),
    (0, swagger_1.ApiParam)({ name: 'workspaceId', example: 1, description: 'Workspace id' }),
    (0, swagger_1.ApiParam)({ name: 'commentId', example: 52, description: 'Comment id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Comment updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "code: 'COMMENT_EDIT_FORBIDDEN' | code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'RESOURCE_WORKSPACE_MISMATCH'" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "code: 'COMMENT_NOT_FOUND'" }),
    __param(0, (0, common_1.Param)('commentId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_comment_dto_1.UpdateCommentDto, Object]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "updateComment", null);
__decorate([
    (0, common_1.Delete)('comments/:commentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete comment' }),
    (0, swagger_1.ApiParam)({ name: 'workspaceId', example: 1, description: 'Workspace id' }),
    (0, swagger_1.ApiParam)({ name: 'commentId', example: 52, description: 'Comment id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Comment deleted successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "code: 'COMMENT_DELETE_FORBIDDEN' | code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'WORKSPACE_ACTION_FORBIDDEN'" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "code: 'COMMENT_NOT_FOUND'" }),
    __param(0, (0, common_1.Param)('commentId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "deleteComment", null);
exports.CommentController = CommentController = __decorate([
    (0, swagger_1.ApiTags)('comment'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, workspace_access_guard_1.WorkspaceAccessGuard, workspace_resource_guard_1.WorkspaceResourceGuard),
    (0, common_1.Controller)('workspace/:workspaceId'),
    __metadata("design:paramtypes", [comment_service_1.CommentService])
], CommentController);
//# sourceMappingURL=comment.controller.js.map