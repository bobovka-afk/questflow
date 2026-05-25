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
exports.WorkspaceActivityController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../auth/guards/auth.guard");
const workspace_access_guard_1 = require("../common/guards/workspace-access.guard");
const workspace_role_guard_1 = require("../common/guards/workspace-role.guard");
const workspace_roles_decorator_1 = require("../common/decorators/workspace-roles.decorator");
const enums_1 = require("../generated/prisma/enums");
const pagination_dto_1 = require("../workspace/dto/pagination.dto");
const workspace_activity_service_1 = require("./workspace-activity.service");
let WorkspaceActivityController = class WorkspaceActivityController {
    workspaceActivityService;
    constructor(workspaceActivityService) {
        this.workspaceActivityService = workspaceActivityService;
    }
    async listWorkspaceActivity(workspaceId, paginationDto) {
        return this.workspaceActivityService.listByWorkspace(workspaceId, paginationDto);
    }
};
exports.WorkspaceActivityController = WorkspaceActivityController;
__decorate([
    (0, common_1.UseGuards)(workspace_access_guard_1.WorkspaceAccessGuard, workspace_role_guard_1.WorkspaceRoleGuard),
    (0, workspace_roles_decorator_1.WorkspaceRoles)(enums_1.WorkspaceRole.OWNER, enums_1.WorkspaceRole.ADMIN),
    (0, common_1.Get)(':workspaceId/activity'),
    (0, swagger_1.ApiOperation)({ summary: 'List workspace activity (owner/admin)' }),
    (0, swagger_1.ApiParam)({ name: 'workspaceId', example: 1 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Activity rows (newest first)' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "code: 'WORKSPACE_ID_REQUIRED'" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'WORKSPACE_ACTION_FORBIDDEN'" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "code: 'WORKSPACE_NOT_FOUND'" }),
    __param(0, (0, common_1.Param)('workspaceId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], WorkspaceActivityController.prototype, "listWorkspaceActivity", null);
exports.WorkspaceActivityController = WorkspaceActivityController = __decorate([
    (0, swagger_1.ApiTags)('workspace-activity'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('workspace'),
    __metadata("design:paramtypes", [workspace_activity_service_1.WorkspaceActivityService])
], WorkspaceActivityController);
//# sourceMappingURL=workspace-activity.controller.js.map