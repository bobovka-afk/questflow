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
exports.UpdateCharacterDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../generated/prisma/enums");
class UpdateCharacterDto {
    name;
    gender;
    avatarPreset;
}
exports.UpdateCharacterDto = UpdateCharacterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Board Guardian',
        description: 'Character name',
        minLength: 3,
        maxLength: 40,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(40),
    __metadata("design:type", String)
], UpdateCharacterDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: enums_1.GenderCharacter,
        example: enums_1.GenderCharacter.FEMALE,
        description: 'Character gender',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.GenderCharacter),
    __metadata("design:type", String)
], UpdateCharacterDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: enums_1.CharacterAvatarPreset,
        example: enums_1.CharacterAvatarPreset.MAGE_WOMAN,
        description: 'Portrait preset; must match character gender',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.CharacterAvatarPreset),
    __metadata("design:type", String)
], UpdateCharacterDto.prototype, "avatarPreset", void 0);
//# sourceMappingURL=update-character.dto.js.map