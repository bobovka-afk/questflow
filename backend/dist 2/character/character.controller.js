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
exports.CharacterController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const character_service_1 = require("./character.service");
const auth_guard_1 = require("../auth/guards/auth.guard");
const create_character_dto_1 = require("./dto/create-character.dto");
const update_character_dto_1 = require("./dto/update-character.dto");
let CharacterController = class CharacterController {
    characterService;
    constructor(characterService) {
        this.characterService = characterService;
    }
    async getCharacter(req) {
        return this.characterService.getCharacter(req.user.id);
    }
    async getCharacterByUserId(userId) {
        return this.characterService.getCharacter(userId);
    }
    async createCharacter(req, dto) {
        return this.characterService.createCharacter(req.user.id, dto);
    }
    async updateCharacter(req, dto) {
        return this.characterService.updateCharacter(req.user.id, dto);
    }
    async dailyCheckin(req) {
        return this.characterService.dailyCheckin(req.user.id);
    }
};
exports.CharacterController = CharacterController;
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user character' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Character returned.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Character not found.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CharacterController.prototype, "getCharacter", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get character by user id (any authenticated user)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Character returned.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "code: 'CHARACTER_NOT_FOUND'" }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CharacterController.prototype, "getCharacterByUserId", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create character (one per user)' }),
    (0, swagger_1.ApiBody)({ type: create_character_dto_1.CreateCharacterDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Character created.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation or duplicate character.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required.' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_character_dto_1.CreateCharacterDto]),
    __metadata("design:returntype", Promise)
], CharacterController.prototype, "createCharacter", null);
__decorate([
    (0, common_1.Patch)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Update current user character' }),
    (0, swagger_1.ApiBody)({ type: update_character_dto_1.UpdateCharacterDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Character updated.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Character not found.' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_character_dto_1.UpdateCharacterDto]),
    __metadata("design:returntype", Promise)
], CharacterController.prototype, "updateCharacter", null);
__decorate([
    (0, common_1.Post)('checkin'),
    (0, swagger_1.ApiOperation)({ summary: 'Daily check-in (+100 XP, once per game day)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Check-in completed, character updated.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "code: 'CHARACTER_NOT_FOUND'" }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: "code: 'CHECKIN_ALREADY_DONE' — already checked in today",
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CharacterController.prototype, "dailyCheckin", null);
exports.CharacterController = CharacterController = __decorate([
    (0, swagger_1.ApiTags)('character'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('character'),
    __metadata("design:paramtypes", [character_service_1.CharacterService])
], CharacterController);
//# sourceMappingURL=character.controller.js.map