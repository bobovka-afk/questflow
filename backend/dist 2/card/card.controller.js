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
exports.CardController = void 0;
const common_1 = require("@nestjs/common");
const card_service_1 = require("./card.service");
const auth_guard_1 = require("../auth/guards/auth.guard");
const workspace_access_guard_1 = require("../common/guards/workspace-access.guard");
const workspace_resource_guard_1 = require("../common/guards/workspace-resource.guard");
const create_card_dto_1 = require("./dto/create-card.dto");
const move_card_dto_1 = require("./dto/move-card.dto");
const set_card_completion_dto_1 = require("./dto/set-card-completion.dto");
const update_card_dto_1 = require("./dto/update-card.dto");
const swagger_1 = require("@nestjs/swagger");
let CardController = class CardController {
    cardService;
    constructor(cardService) {
        this.cardService = cardService;
    }
    async getCards(listId) {
        return this.cardService.getCards(listId);
    }
    async createCard(listId, dto) {
        return this.cardService.createCard(listId, dto);
    }
    async moveCard(cardId, dto) {
        return this.cardService.moveCard(cardId, dto);
    }
    async setCardCompletion(req, cardId, dto) {
        return this.cardService.setCardCompletion(cardId, dto, req.user.id);
    }
    async updateCard(cardId, dto) {
        return this.cardService.updateCard(cardId, dto);
    }
    async deleteCard(cardId) {
        return this.cardService.deleteCard(cardId);
    }
};
exports.CardController = CardController;
__decorate([
    (0, common_1.Get)('lists/:listId/cards'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cards for a list' }),
    (0, swagger_1.ApiParam)({ name: 'workspaceId', example: 1, description: 'Workspace id' }),
    (0, swagger_1.ApiParam)({ name: 'listId', example: 11, description: 'List id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cards returned successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "code: 'WORKSPACE_MEMBER_REQUIRED' | code: 'WORKSPACE_ACTION_FORBIDDEN' | code: 'RESOURCE_WORKSPACE_MISMATCH'" }),
    __param(0, (0, common_1.Param)('listId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CardController.prototype, "getCards", null);
__decorate([
    (0, common_1.Post)('lists/:listId/cards'),
    (0, swagger_1.ApiOperation)({ summary: 'Create card' }),
    (0, swagger_1.ApiBody)({ type: create_card_dto_1.CreateCardDto, description: 'Card creation payload' }),
    (0, swagger_1.ApiParam)({ name: 'workspaceId', example: 1, description: 'Workspace id' }),
    (0, swagger_1.ApiParam)({ name: 'listId', example: 11, description: 'List id' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Card created successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "code: 'LIST_ID_REQUIRED' | code: 'WORKSPACE_ID_REQUIRED'" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    __param(0, (0, common_1.Param)('listId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_card_dto_1.CreateCardDto]),
    __metadata("design:returntype", Promise)
], CardController.prototype, "createCard", null);
__decorate([
    (0, common_1.Patch)('cards/:cardId/move'),
    (0, swagger_1.ApiOperation)({ summary: 'Move card to another list or position' }),
    (0, swagger_1.ApiBody)({ type: move_card_dto_1.MoveCardDto, description: 'Card move payload' }),
    (0, swagger_1.ApiParam)({ name: 'workspaceId', example: 1, description: 'Workspace id' }),
    (0, swagger_1.ApiParam)({ name: 'cardId', example: 35, description: 'Card id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Card moved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "code: 'CARD_MOVE_CROSS_BOARD' | code: 'CARD_ID_REQUIRED'" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "code: 'CARD_NOT_FOUND' | code: 'LIST_NOT_FOUND'" }),
    __param(0, (0, common_1.Param)('cardId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, move_card_dto_1.MoveCardDto]),
    __metadata("design:returntype", Promise)
], CardController.prototype, "moveCard", null);
__decorate([
    (0, common_1.Patch)('cards/:cardId/completion'),
    (0, swagger_1.ApiOperation)({ summary: 'Set card completion state' }),
    (0, swagger_1.ApiBody)({ type: set_card_completion_dto_1.SetCardCompletionDto, description: 'Card completion payload' }),
    (0, swagger_1.ApiParam)({ name: 'workspaceId', example: 1, description: 'Workspace id' }),
    (0, swagger_1.ApiParam)({ name: 'cardId', example: 35, description: 'Card id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Card completion state updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "code: 'CARD_ID_REQUIRED'" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "code: 'CARD_NOT_FOUND'" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('cardId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, set_card_completion_dto_1.SetCardCompletionDto]),
    __metadata("design:returntype", Promise)
], CardController.prototype, "setCardCompletion", null);
__decorate([
    (0, common_1.Patch)('cards/:cardId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update card' }),
    (0, swagger_1.ApiBody)({ type: update_card_dto_1.UpdateCardDto, description: 'Card update payload' }),
    (0, swagger_1.ApiParam)({ name: 'workspaceId', example: 1, description: 'Workspace id' }),
    (0, swagger_1.ApiParam)({ name: 'cardId', example: 35, description: 'Card id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Card updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "code: 'CARD_UPDATE_FIELDS_REQUIRED' | code: 'CARD_ID_REQUIRED'" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "code: 'CARD_NOT_FOUND'" }),
    __param(0, (0, common_1.Param)('cardId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_card_dto_1.UpdateCardDto]),
    __metadata("design:returntype", Promise)
], CardController.prototype, "updateCard", null);
__decorate([
    (0, common_1.Delete)('cards/:cardId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete card' }),
    (0, swagger_1.ApiParam)({ name: 'workspaceId', example: 1, description: 'Workspace id' }),
    (0, swagger_1.ApiParam)({ name: 'cardId', example: 35, description: 'Card id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Card deleted successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "code: 'CARD_NOT_FOUND'" }),
    __param(0, (0, common_1.Param)('cardId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CardController.prototype, "deleteCard", null);
exports.CardController = CardController = __decorate([
    (0, swagger_1.ApiTags)('card'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, workspace_access_guard_1.WorkspaceAccessGuard, workspace_resource_guard_1.WorkspaceResourceGuard),
    (0, common_1.Controller)('workspace/:workspaceId'),
    __metadata("design:paramtypes", [card_service_1.CardService])
], CardController);
//# sourceMappingURL=card.controller.js.map