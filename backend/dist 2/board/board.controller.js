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
exports.BoardController = void 0;
const common_1 = require("@nestjs/common");
const board_service_1 = require("./board.service");
const auth_guard_1 = require("../auth/guards/auth.guard");
const common_2 = require("@nestjs/common");
const create_board_dto_1 = require("./dto/create-board.dto");
const update_board_dto_1 = require("./dto/update-board.dto");
const common_3 = require("@nestjs/common");
const workspace_access_guard_1 = require("../common/guards/workspace-access.guard");
const workspace_role_guard_1 = require("../common/guards/workspace-role.guard");
const workspace_resource_guard_1 = require("../common/guards/workspace-resource.guard");
const workspace_roles_decorator_1 = require("../common/decorators/workspace-roles.decorator");
const enums_1 = require("../generated/prisma/enums");
const swagger_1 = require("@nestjs/swagger");
let BoardController = class BoardController {
    boardService;
    constructor(boardService) {
        this.boardService = boardService;
    }
    async createBoard(workspaceId, dto) {
        return this.boardService.createBoard(workspaceId, dto);
    }
    async getBoard(boardId) {
        return this.boardService.getBoard(boardId);
    }
    async getBoards(workspaceId) {
        return this.boardService.getBoards(workspaceId);
    }
    async updateBoard(boardId, dto) {
        return this.boardService.updateBoard(boardId, dto);
    }
    async deleteBoard(boardId) {
        return this.boardService.deleteBoard(boardId);
    }
};
exports.BoardController = BoardController;
__decorate([
    (0, common_2.UseGuards)(workspace_role_guard_1.WorkspaceRoleGuard),
    (0, workspace_roles_decorator_1.WorkspaceRoles)(enums_1.WorkspaceRole.OWNER, enums_1.WorkspaceRole.ADMIN),
    (0, common_3.Post)('boards'),
    (0, swagger_1.ApiOperation)({ summary: 'Create board' }),
    (0, swagger_1.ApiBody)({ type: create_board_dto_1.CreateBoardDto, description: 'Board creation payload' }),
    (0, swagger_1.ApiParam)({ name: 'workspaceId', example: 1, description: 'Workspace id' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Board created successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "code: 'WORKSPACE_ID_REQUIRED'" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'WORKSPACE_ACTION_FORBIDDEN' | code: 'RESOURCE_WORKSPACE_MISMATCH'" }),
    __param(0, (0, common_3.Param)('workspaceId', common_3.ParseIntPipe)),
    __param(1, (0, common_3.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_board_dto_1.CreateBoardDto]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "createBoard", null);
__decorate([
    (0, common_3.Get)('boards/:boardId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get board details' }),
    (0, swagger_1.ApiParam)({ name: 'workspaceId', example: 1, description: 'Workspace id' }),
    (0, swagger_1.ApiParam)({ name: 'boardId', example: 7, description: 'Board id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Board details returned successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "code: 'BOARD_ID_REQUIRED' | code: 'WORKSPACE_ID_REQUIRED'" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'RESOURCE_WORKSPACE_MISMATCH'" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "code: 'BOARD_NOT_FOUND' | code: 'WORKSPACE_NOT_FOUND'" }),
    __param(0, (0, common_3.Param)('boardId', common_3.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "getBoard", null);
__decorate([
    (0, common_3.Get)('boards'),
    (0, swagger_1.ApiOperation)({ summary: 'Get workspace boards' }),
    (0, swagger_1.ApiParam)({ name: 'workspaceId', example: 1, description: 'Workspace id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Workspace boards returned successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'WORKSPACE_ACTION_FORBIDDEN' | code: 'RESOURCE_WORKSPACE_MISMATCH'" }),
    __param(0, (0, common_3.Param)('workspaceId', common_3.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "getBoards", null);
__decorate([
    (0, common_2.UseGuards)(workspace_role_guard_1.WorkspaceRoleGuard),
    (0, workspace_roles_decorator_1.WorkspaceRoles)(enums_1.WorkspaceRole.OWNER, enums_1.WorkspaceRole.ADMIN),
    (0, common_3.Patch)('boards/:boardId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update board' }),
    (0, swagger_1.ApiBody)({ type: update_board_dto_1.UpdateBoardDto, description: 'Board update payload' }),
    (0, swagger_1.ApiParam)({ name: 'workspaceId', example: 1, description: 'Workspace id' }),
    (0, swagger_1.ApiParam)({ name: 'boardId', example: 7, description: 'Board id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Board updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "code: 'BOARD_UPDATE_FIELDS_REQUIRED' | code: 'BOARD_ID_REQUIRED' | code: 'WORKSPACE_ID_REQUIRED'" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'WORKSPACE_ACTION_FORBIDDEN' | code: 'RESOURCE_WORKSPACE_MISMATCH'" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "code: 'BOARD_NOT_FOUND'" }),
    __param(0, (0, common_3.Param)('boardId', common_3.ParseIntPipe)),
    __param(1, (0, common_3.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_board_dto_1.UpdateBoardDto]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "updateBoard", null);
__decorate([
    (0, common_2.UseGuards)(workspace_role_guard_1.WorkspaceRoleGuard),
    (0, workspace_roles_decorator_1.WorkspaceRoles)(enums_1.WorkspaceRole.OWNER, enums_1.WorkspaceRole.ADMIN),
    (0, common_3.Delete)('boards/:boardId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete board' }),
    (0, swagger_1.ApiParam)({ name: 'workspaceId', example: 1, description: 'Workspace id' }),
    (0, swagger_1.ApiParam)({ name: 'boardId', example: 7, description: 'Board id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Board deleted successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'WORKSPACE_ACTION_FORBIDDEN' | code: 'RESOURCE_WORKSPACE_MISMATCH'" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "code: 'BOARD_NOT_FOUND'" }),
    __param(0, (0, common_3.Param)('boardId', common_3.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "deleteBoard", null);
exports.BoardController = BoardController = __decorate([
    (0, swagger_1.ApiTags)('board'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_2.UseGuards)(auth_guard_1.JwtAuthGuard, workspace_access_guard_1.WorkspaceAccessGuard, workspace_resource_guard_1.WorkspaceResourceGuard),
    (0, common_1.Controller)('workspace/:workspaceId'),
    __metadata("design:paramtypes", [board_service_1.BoardService])
], BoardController);
//# sourceMappingURL=board.controller.js.map