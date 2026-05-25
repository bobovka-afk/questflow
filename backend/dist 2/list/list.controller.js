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
exports.ListController = void 0;
const common_1 = require("@nestjs/common");
const list_service_1 = require("./list.service");
const auth_guard_1 = require("../auth/guards/auth.guard");
const create_list_dto_1 = require("./dto/create-list.dto");
const move_list_dto_1 = require("./dto/move-list.dto");
const update_list_dto_1 = require("./dto/update-list.dto");
const workspace_access_guard_1 = require("../common/guards/workspace-access.guard");
const workspace_role_guard_1 = require("../common/guards/workspace-role.guard");
const workspace_resource_guard_1 = require("../common/guards/workspace-resource.guard");
const workspace_roles_decorator_1 = require("../common/decorators/workspace-roles.decorator");
const enums_1 = require("../generated/prisma/enums");
const swagger_1 = require("@nestjs/swagger");
let ListController = class ListController {
    listService;
    constructor(listService) {
        this.listService = listService;
    }
    async getLists(boardId) {
        return this.listService.getLists(boardId);
    }
    async createList(boardId, dto) {
        return this.listService.createList(boardId, dto);
    }
    async moveList(listId, dto) {
        return this.listService.moveList(listId, dto);
    }
    async updateList(listId, dto) {
        return this.listService.updateList(listId, dto);
    }
    async deleteList(listId) {
        return this.listService.deleteList(listId);
    }
};
exports.ListController = ListController;
__decorate([
    (0, common_1.Get)('board/:boardId/lists'),
    (0, swagger_1.ApiOperation)({ summary: 'Get board lists' }),
    (0, swagger_1.ApiParam)({ name: 'workspaceId', example: 1, description: 'Workspace id' }),
    (0, swagger_1.ApiParam)({ name: 'boardId', example: 7, description: 'Board id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Board lists returned successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'WORKSPACE_ACTION_FORBIDDEN' | code: 'RESOURCE_WORKSPACE_MISMATCH'" }),
    __param(0, (0, common_1.Param)('boardId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ListController.prototype, "getLists", null);
__decorate([
    (0, common_1.UseGuards)(workspace_role_guard_1.WorkspaceRoleGuard),
    (0, workspace_roles_decorator_1.WorkspaceRoles)(enums_1.WorkspaceRole.OWNER, enums_1.WorkspaceRole.ADMIN),
    (0, common_1.Post)('board/:boardId/lists'),
    (0, swagger_1.ApiOperation)({ summary: 'Create list' }),
    (0, swagger_1.ApiBody)({ type: create_list_dto_1.CreateListDto, description: 'List creation payload' }),
    (0, swagger_1.ApiParam)({ name: 'workspaceId', example: 1, description: 'Workspace id' }),
    (0, swagger_1.ApiParam)({ name: 'boardId', example: 7, description: 'Board id' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'List created successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "code: 'BOARD_ID_REQUIRED' | code: 'WORKSPACE_ID_REQUIRED'" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'WORKSPACE_ACTION_FORBIDDEN' | code: 'RESOURCE_WORKSPACE_MISMATCH'" }),
    __param(0, (0, common_1.Param)('boardId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_list_dto_1.CreateListDto]),
    __metadata("design:returntype", Promise)
], ListController.prototype, "createList", null);
__decorate([
    (0, common_1.Patch)('lists/:listId/move'),
    (0, swagger_1.ApiOperation)({ summary: 'Reorder list within its board' }),
    (0, swagger_1.ApiBody)({ type: move_list_dto_1.MoveListDto, description: 'Target index within the board' }),
    (0, swagger_1.ApiParam)({ name: 'workspaceId', example: 1, description: 'Workspace id' }),
    (0, swagger_1.ApiParam)({ name: 'listId', example: 11, description: 'List id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List order updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "code: 'LIST_ID_REQUIRED' | code: 'WORKSPACE_ID_REQUIRED'" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'WORKSPACE_ACTION_FORBIDDEN' | code: 'RESOURCE_WORKSPACE_MISMATCH'" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "code: 'LIST_NOT_FOUND'" }),
    __param(0, (0, common_1.Param)('listId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, move_list_dto_1.MoveListDto]),
    __metadata("design:returntype", Promise)
], ListController.prototype, "moveList", null);
__decorate([
    (0, common_1.UseGuards)(workspace_role_guard_1.WorkspaceRoleGuard),
    (0, workspace_roles_decorator_1.WorkspaceRoles)(enums_1.WorkspaceRole.OWNER, enums_1.WorkspaceRole.ADMIN),
    (0, common_1.Patch)('lists/:listId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update list' }),
    (0, swagger_1.ApiBody)({ type: update_list_dto_1.UpdateListDto, description: 'List update payload' }),
    (0, swagger_1.ApiParam)({ name: 'workspaceId', example: 1, description: 'Workspace id' }),
    (0, swagger_1.ApiParam)({ name: 'listId', example: 11, description: 'List id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "code: 'LIST_UPDATE_FIELDS_REQUIRED' | code: 'LIST_ID_REQUIRED'" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'WORKSPACE_ACTION_FORBIDDEN' | code: 'RESOURCE_WORKSPACE_MISMATCH'" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "code: 'LIST_NOT_FOUND'" }),
    __param(0, (0, common_1.Param)('listId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_list_dto_1.UpdateListDto]),
    __metadata("design:returntype", Promise)
], ListController.prototype, "updateList", null);
__decorate([
    (0, common_1.UseGuards)(workspace_role_guard_1.WorkspaceRoleGuard),
    (0, workspace_roles_decorator_1.WorkspaceRoles)(enums_1.WorkspaceRole.OWNER, enums_1.WorkspaceRole.ADMIN),
    (0, common_1.Delete)('lists/:listId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete list' }),
    (0, swagger_1.ApiParam)({ name: 'workspaceId', example: 1, description: 'Workspace id' }),
    (0, swagger_1.ApiParam)({ name: 'listId', example: 11, description: 'List id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List deleted successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'WORKSPACE_ACTION_FORBIDDEN' | code: 'RESOURCE_WORKSPACE_MISMATCH'" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "code: 'LIST_NOT_FOUND'" }),
    __param(0, (0, common_1.Param)('listId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ListController.prototype, "deleteList", null);
exports.ListController = ListController = __decorate([
    (0, swagger_1.ApiTags)('list'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, workspace_access_guard_1.WorkspaceAccessGuard, workspace_resource_guard_1.WorkspaceResourceGuard),
    (0, common_1.Controller)('workspace/:workspaceId'),
    __metadata("design:paramtypes", [list_service_1.ListService])
], ListController);
//# sourceMappingURL=list.controller.js.map