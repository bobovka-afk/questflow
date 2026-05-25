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
exports.WorkspaceInviteController = void 0;
const common_1 = require("@nestjs/common");
const workspace_invite_service_1 = require("./workspace-invite.service");
const common_2 = require("@nestjs/common");
const common_3 = require("@nestjs/common");
const common_4 = require("@nestjs/common");
const common_5 = require("@nestjs/common");
const common_6 = require("@nestjs/common");
const common_7 = require("@nestjs/common");
const common_8 = require("@nestjs/common");
const common_9 = require("@nestjs/common");
const common_10 = require("@nestjs/common");
const send_invite_dto_1 = require("./dto/send-invite.dto");
const accept_invite_token_dto_1 = require("./dto/accept-invite-token.dto");
const auth_guard_1 = require("../auth/guards/auth.guard");
const pagination_dto_1 = require("../workspace/dto/pagination.dto");
const workspace_access_guard_1 = require("../common/guards/workspace-access.guard");
const workspace_role_guard_1 = require("../common/guards/workspace-role.guard");
const workspace_roles_decorator_1 = require("../common/decorators/workspace-roles.decorator");
const enums_1 = require("../generated/prisma/enums");
const rate_limit_decorator_1 = require("../common/decorators/rate-limit.decorator");
const rate_limit_guard_1 = require("../common/guards/rate-limit.guard");
const swagger_1 = require("@nestjs/swagger");
let WorkspaceInviteController = class WorkspaceInviteController {
    workspaceInviteService;
    constructor(workspaceInviteService) {
        this.workspaceInviteService = workspaceInviteService;
    }
    async getMyInvites(req, paginationDto) {
        return this.workspaceInviteService.getMyInvites(req.user.id, paginationDto);
    }
    async getWorkspaceInvites(workspaceId, paginationDto) {
        return this.workspaceInviteService.getWorkspaceInvites(workspaceId, paginationDto);
    }
    async sendInvite(workspaceId, req, dto) {
        return this.workspaceInviteService.sendInvite(dto, req.user.id, workspaceId);
    }
    async acceptInviteByToken(req, dto) {
        return this.workspaceInviteService.acceptInviteByToken(dto.token, req.user.id);
    }
    async acceptInvite(inviteId, req) {
        return this.workspaceInviteService.acceptInvite(inviteId, req.user.id);
    }
    async declineInvite(inviteId, req) {
        return this.workspaceInviteService.declineInvite(inviteId, req.user.id);
    }
    async deleteInvite(req, workspaceId, inviteId) {
        return this.workspaceInviteService.deleteInvite(inviteId, workspaceId, req.user.id);
    }
};
exports.WorkspaceInviteController = WorkspaceInviteController;
__decorate([
    (0, common_3.Get)('my'),
    (0, swagger_1.ApiOperation)({ summary: 'Get invites for current user' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 10, description: 'Maximum number of records to return' }),
    (0, swagger_1.ApiQuery)({ name: 'offset', required: false, example: 0, description: 'Number of records to skip' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Current user invites returned successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    __param(0, (0, common_4.Req)()),
    __param(1, (0, common_9.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], WorkspaceInviteController.prototype, "getMyInvites", null);
__decorate([
    (0, common_2.UseGuards)(workspace_access_guard_1.WorkspaceAccessGuard, workspace_role_guard_1.WorkspaceRoleGuard),
    (0, workspace_roles_decorator_1.WorkspaceRoles)(enums_1.WorkspaceRole.OWNER, enums_1.WorkspaceRole.ADMIN),
    (0, common_3.Get)(':workspaceId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get invites for a workspace' }),
    (0, swagger_1.ApiParam)({ name: 'workspaceId', example: 1, description: 'Workspace id' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 10, description: 'Maximum number of records to return' }),
    (0, swagger_1.ApiQuery)({ name: 'offset', required: false, example: 0, description: 'Number of records to skip' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Workspace invites returned successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'WORKSPACE_ACTION_FORBIDDEN' | code: 'RESOURCE_WORKSPACE_MISMATCH'" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "code: 'WORKSPACE_NOT_FOUND'" }),
    __param(0, (0, common_6.Param)('workspaceId', common_7.ParseIntPipe)),
    __param(1, (0, common_9.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], WorkspaceInviteController.prototype, "getWorkspaceInvites", null);
__decorate([
    (0, common_2.UseGuards)(workspace_access_guard_1.WorkspaceAccessGuard, workspace_role_guard_1.WorkspaceRoleGuard),
    (0, workspace_roles_decorator_1.WorkspaceRoles)(enums_1.WorkspaceRole.OWNER, enums_1.WorkspaceRole.ADMIN),
    (0, common_5.Post)('create/:workspaceId'),
    (0, common_2.UseGuards)(rate_limit_guard_1.RateLimitGuard),
    (0, rate_limit_decorator_1.RateLimit)({ key: 'workspace-invite:create', limit: 5, windowSec: 300 }),
    (0, swagger_1.ApiOperation)({ summary: 'Create workspace invite' }),
    (0, swagger_1.ApiBody)({ type: send_invite_dto_1.SendInviteDto, description: 'Workspace invite creation payload' }),
    (0, swagger_1.ApiParam)({ name: 'workspaceId', example: 1, description: 'Workspace id' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Workspace invite created successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "code: 'INVITE_MAIL_FAILED' | code: 'WORKSPACE_ID_REQUIRED'" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'WORKSPACE_ACTION_FORBIDDEN'" }),
    (0, swagger_1.ApiResponse)({ status: 409, description: "code: 'USER_ALREADY_MEMBER' | code: 'INVITE_ALREADY_SENT'" }),
    (0, swagger_1.ApiResponse)({ status: 429, description: "code: 'RATE_LIMIT_EXCEEDED'" }),
    __param(0, (0, common_6.Param)('workspaceId', common_7.ParseIntPipe)),
    __param(1, (0, common_4.Req)()),
    __param(2, (0, common_8.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, send_invite_dto_1.SendInviteDto]),
    __metadata("design:returntype", Promise)
], WorkspaceInviteController.prototype, "sendInvite", null);
__decorate([
    (0, common_5.Post)('accept-token'),
    (0, common_2.UseGuards)(rate_limit_guard_1.RateLimitGuard),
    (0, rate_limit_decorator_1.RateLimit)({ key: 'workspace-invite:accept-token', limit: 10, windowSec: 300 }),
    (0, swagger_1.ApiOperation)({ summary: 'Accept workspace invite by token' }),
    (0, swagger_1.ApiBody)({ type: accept_invite_token_dto_1.AcceptInviteTokenDto, description: 'Workspace invite token payload' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Workspace invite accepted successfully by token.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "code: 'INVITE_EXPIRED'" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "code: 'INVITE_ACCESS_DENIED'" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "code: 'INVITE_NOT_FOUND' | code: 'USER_NOT_FOUND'" }),
    (0, swagger_1.ApiResponse)({ status: 409, description: "code: 'INVITE_ALREADY_PROCESSED' | code: 'USER_ALREADY_MEMBER'" }),
    (0, swagger_1.ApiResponse)({ status: 429, description: "code: 'RATE_LIMIT_EXCEEDED'" }),
    __param(0, (0, common_4.Req)()),
    __param(1, (0, common_8.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, accept_invite_token_dto_1.AcceptInviteTokenDto]),
    __metadata("design:returntype", Promise)
], WorkspaceInviteController.prototype, "acceptInviteByToken", null);
__decorate([
    (0, common_5.Post)(':inviteId/accept'),
    (0, swagger_1.ApiOperation)({ summary: 'Accept workspace invite by id' }),
    (0, swagger_1.ApiParam)({ name: 'inviteId', example: 15, description: 'Invite id' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Workspace invite accepted successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "code: 'INVITE_NOT_FOUND'" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "code: 'INVITE_EXPIRED'" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "code: 'INVITE_ACCESS_DENIED'" }),
    (0, swagger_1.ApiResponse)({ status: 409, description: "code: 'INVITE_ALREADY_PROCESSED' | code: 'USER_ALREADY_MEMBER'" }),
    __param(0, (0, common_6.Param)('inviteId', common_7.ParseIntPipe)),
    __param(1, (0, common_4.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], WorkspaceInviteController.prototype, "acceptInvite", null);
__decorate([
    (0, common_5.Post)(':inviteId/decline'),
    (0, swagger_1.ApiOperation)({ summary: 'Decline workspace invite by id' }),
    (0, swagger_1.ApiParam)({ name: 'inviteId', example: 15, description: 'Invite id' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Workspace invite declined successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "code: 'INVITE_NOT_FOUND'" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "code: 'INVITE_ACCESS_DENIED'" }),
    (0, swagger_1.ApiResponse)({ status: 409, description: "code: 'INVITE_ALREADY_PROCESSED'" }),
    __param(0, (0, common_6.Param)('inviteId', common_7.ParseIntPipe)),
    __param(1, (0, common_4.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], WorkspaceInviteController.prototype, "declineInvite", null);
__decorate([
    (0, common_2.UseGuards)(workspace_access_guard_1.WorkspaceAccessGuard, workspace_role_guard_1.WorkspaceRoleGuard),
    (0, workspace_roles_decorator_1.WorkspaceRoles)(enums_1.WorkspaceRole.OWNER, enums_1.WorkspaceRole.ADMIN),
    (0, common_10.Delete)(':workspaceId/:inviteId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete workspace invite' }),
    (0, swagger_1.ApiParam)({ name: 'workspaceId', example: 1, description: 'Workspace id' }),
    (0, swagger_1.ApiParam)({ name: 'inviteId', example: 15, description: 'Invite id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Workspace invite deleted successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'WORKSPACE_ACTION_FORBIDDEN' | code: 'RESOURCE_WORKSPACE_MISMATCH'" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "code: 'INVITE_NOT_FOUND'" }),
    __param(0, (0, common_4.Req)()),
    __param(1, (0, common_6.Param)('workspaceId', common_7.ParseIntPipe)),
    __param(2, (0, common_6.Param)('inviteId', common_7.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], WorkspaceInviteController.prototype, "deleteInvite", null);
exports.WorkspaceInviteController = WorkspaceInviteController = __decorate([
    (0, swagger_1.ApiTags)('workspace-invite'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_2.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('workspace-invite'),
    __metadata("design:paramtypes", [workspace_invite_service_1.WorkspaceInviteService])
], WorkspaceInviteController);
//# sourceMappingURL=workspace-invite.controller.js.map