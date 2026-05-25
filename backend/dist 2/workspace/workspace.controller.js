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
exports.WorkspaceController = void 0;
const common_1 = require("@nestjs/common");
const workspace_service_1 = require("./workspace.service");
const auth_guard_1 = require("../auth/guards/auth.guard");
const common_2 = require("@nestjs/common");
const create_workspace_dto_1 = require("./dto/create-workspace.dto");
const pagination_dto_1 = require("./dto/pagination.dto");
const update_workspace_dto_1 = require("./dto/update-workspace.dto");
const workspace_access_guard_1 = require("../common/guards/workspace-access.guard");
const workspace_role_guard_1 = require("../common/guards/workspace-role.guard");
const workspace_roles_decorator_1 = require("../common/decorators/workspace-roles.decorator");
const enums_1 = require("../generated/prisma/enums");
const swagger_1 = require("@nestjs/swagger");
let WorkspaceController = class WorkspaceController {
    workspaceService;
    constructor(workspaceService) {
        this.workspaceService = workspaceService;
    }
    async createWorkspace(req, dto) {
        return this.workspaceService.createWorkspace(dto, req.user.id);
    }
    async getUserWorkspaces(req, paginationDto) {
        return this.workspaceService.getUserWorkspaces(req.user.id, paginationDto);
    }
    async getWorkspaceSummary(workspaceId, req) {
        return this.workspaceService.getWorkspaceSummary(workspaceId, req.user.id);
    }
    async updateWorkspace(workspaceId, dto, req) {
        return this.workspaceService.updateWorkspace(workspaceId, dto, req.user.id);
    }
    async deleteWorkspace(workspaceId) {
        return this.workspaceService.deleteWorkspace(workspaceId);
    }
};
exports.WorkspaceController = WorkspaceController;
__decorate([
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a workspace' }),
    (0, swagger_1.ApiBody)({ type: create_workspace_dto_1.CreateWorkspaceDto, description: 'Workspace creation payload' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Workspace created successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_workspace_dto_1.CreateWorkspaceDto]),
    __metadata("design:returntype", Promise)
], WorkspaceController.prototype, "createWorkspace", null);
__decorate([
    (0, common_1.Get)('get-user-workspaces'),
    (0, swagger_1.ApiOperation)({ summary: 'Get workspaces for current user' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 10, description: 'Maximum number of records to return' }),
    (0, swagger_1.ApiQuery)({ name: 'offset', required: false, example: 0, description: 'Number of records to skip' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User workspaces returned successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], WorkspaceController.prototype, "getUserWorkspaces", null);
__decorate([
    (0, common_2.UseGuards)(workspace_access_guard_1.WorkspaceAccessGuard),
    (0, common_1.Get)(':workspaceId/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get workspace summary' }),
    (0, swagger_1.ApiParam)({ name: 'workspaceId', example: 1, description: 'Workspace id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Workspace summary returned successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "code: 'WORKSPACE_ID_REQUIRED'" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED'" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "code: 'WORKSPACE_NOT_FOUND'" }),
    __param(0, (0, common_1.Param)('workspaceId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], WorkspaceController.prototype, "getWorkspaceSummary", null);
__decorate([
    (0, common_2.UseGuards)(workspace_access_guard_1.WorkspaceAccessGuard, workspace_role_guard_1.WorkspaceRoleGuard),
    (0, workspace_roles_decorator_1.WorkspaceRoles)(enums_1.WorkspaceRole.OWNER, enums_1.WorkspaceRole.ADMIN),
    (0, common_1.Patch)(':workspaceId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update workspace' }),
    (0, swagger_1.ApiBody)({ type: update_workspace_dto_1.UpdateWorkspaceDto, description: 'Workspace update payload' }),
    (0, swagger_1.ApiParam)({ name: 'workspaceId', example: 1, description: 'Workspace id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Workspace updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "code: 'WORKSPACE_UPDATE_FIELDS_REQUIRED' | code: 'WORKSPACE_ID_REQUIRED'" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'WORKSPACE_ACTION_FORBIDDEN'" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "code: 'WORKSPACE_NOT_FOUND'" }),
    __param(0, (0, common_1.Param)('workspaceId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_workspace_dto_1.UpdateWorkspaceDto, Object]),
    __metadata("design:returntype", Promise)
], WorkspaceController.prototype, "updateWorkspace", null);
__decorate([
    (0, common_2.UseGuards)(workspace_access_guard_1.WorkspaceAccessGuard, workspace_role_guard_1.WorkspaceRoleGuard),
    (0, workspace_roles_decorator_1.WorkspaceRoles)(enums_1.WorkspaceRole.OWNER),
    (0, common_1.Delete)(':workspaceId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete workspace' }),
    (0, swagger_1.ApiParam)({ name: 'workspaceId', example: 1, description: 'Workspace id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Workspace deleted successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "code: 'WORKSPACE_ID_REQUIRED'" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'WORKSPACE_ACTION_FORBIDDEN'" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "code: 'WORKSPACE_NOT_FOUND'" }),
    __param(0, (0, common_1.Param)('workspaceId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], WorkspaceController.prototype, "deleteWorkspace", null);
exports.WorkspaceController = WorkspaceController = __decorate([
    (0, swagger_1.ApiTags)('workspace'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_2.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('workspace'),
    __metadata("design:paramtypes", [workspace_service_1.WorkspaceService])
], WorkspaceController);
//# sourceMappingURL=workspace.controller.js.map