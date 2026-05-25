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
exports.WorkspaceMemberController = void 0;
const common_1 = require("@nestjs/common");
const workspace_access_guard_1 = require("../common/guards/workspace-access.guard");
const workspace_role_guard_1 = require("../common/guards/workspace-role.guard");
const workspace_roles_decorator_1 = require("../common/decorators/workspace-roles.decorator");
const enums_1 = require("../generated/prisma/enums");
const pagination_dto_1 = require("../workspace/dto/pagination.dto");
const workspace_member_service_1 = require("./workspace-member.service");
const auth_guard_1 = require("../auth/guards/auth.guard");
const swagger_1 = require("@nestjs/swagger");
let WorkspaceMemberController = class WorkspaceMemberController {
    workspaceMemberService;
    constructor(workspaceMemberService) {
        this.workspaceMemberService = workspaceMemberService;
    }
    async getMembersWorkspace(workspaceId, paginationDto) {
        return this.workspaceMemberService.getWorkspaceMembers(workspaceId, paginationDto);
    }
    async deleteWorkspaceMember(req, workspaceId, memberId) {
        return this.workspaceMemberService.deleteWorkspaceMember(workspaceId, memberId, req.user.id);
    }
    async leaveWorkspace(req, workspaceId) {
        return this.workspaceMemberService.leaveWorkspace(req.user.id, workspaceId);
    }
};
exports.WorkspaceMemberController = WorkspaceMemberController;
__decorate([
    (0, common_1.UseGuards)(workspace_access_guard_1.WorkspaceAccessGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get workspace members' }),
    (0, swagger_1.ApiParam)({ name: 'workspaceId', example: 1, description: 'Workspace id' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 10, description: 'Maximum number of records to return' }),
    (0, swagger_1.ApiQuery)({ name: 'offset', required: false, example: 0, description: 'Number of records to skip' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Workspace members returned successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'WORKSPACE_ACTION_FORBIDDEN' | code: 'RESOURCE_WORKSPACE_MISMATCH'" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "code: 'WORKSPACE_NOT_FOUND'" }),
    __param(0, (0, common_1.Param)('workspaceId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], WorkspaceMemberController.prototype, "getMembersWorkspace", null);
__decorate([
    (0, common_1.UseGuards)(workspace_access_guard_1.WorkspaceAccessGuard, workspace_role_guard_1.WorkspaceRoleGuard),
    (0, workspace_roles_decorator_1.WorkspaceRoles)(enums_1.WorkspaceRole.OWNER, enums_1.WorkspaceRole.ADMIN),
    (0, common_1.Delete)(':memberId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove workspace member' }),
    (0, swagger_1.ApiParam)({ name: 'workspaceId', example: 1, description: 'Workspace id' }),
    (0, swagger_1.ApiParam)({
        name: 'memberId',
        example: 22,
        description: 'User id of the member to remove (User.id, not WorkspaceMember.id)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Workspace member removed successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "code: 'WORKSPACE_ID_REQUIRED'" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'WORKSPACE_ACTION_FORBIDDEN' | code: 'WORKSPACE_OWNER_CANNOT_BE_REMOVED'" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('workspaceId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('memberId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], WorkspaceMemberController.prototype, "deleteWorkspaceMember", null);
__decorate([
    (0, common_1.UseGuards)(workspace_access_guard_1.WorkspaceAccessGuard),
    (0, common_1.Delete)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Leave workspace' }),
    (0, swagger_1.ApiParam)({ name: 'workspaceId', example: 1, description: 'Workspace id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User left the workspace successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'WORKSPACE_ACTION_FORBIDDEN' | code: 'RESOURCE_WORKSPACE_MISMATCH'" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "code: 'WORKSPACE_NOT_FOUND'" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('workspaceId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], WorkspaceMemberController.prototype, "leaveWorkspace", null);
exports.WorkspaceMemberController = WorkspaceMemberController = __decorate([
    (0, swagger_1.ApiTags)('workspace-members'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('workspace/:workspaceId/members'),
    __metadata("design:paramtypes", [workspace_member_service_1.WorkspaceMemberService])
], WorkspaceMemberController);
//# sourceMappingURL=workspace-member.controller.js.map