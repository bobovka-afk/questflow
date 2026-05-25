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
exports.CreateCharacterDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../generated/prisma/enums");
class CreateCharacterDto {
    name;
    gender;
    avatarPreset;
}
exports.CreateCharacterDto = CreateCharacterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Board Guardian',
        description: 'Character name',
        minLength: 3,
        maxLength: 40,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(40),
    __metadata("design:type", String)
], CreateCharacterDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: enums_1.GenderCharacter,
        example: enums_1.GenderCharacter.MALE,
        description: 'Character gender',
    }),
    (0, class_validator_1.IsEnum)(enums_1.GenderCharacter),
    __metadata("design:type", String)
], CreateCharacterDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: enums_1.CharacterAvatarPreset,
        example: enums_1.CharacterAvatarPreset.DRUID_MAN,
        description: 'Portrait preset; must match gender',
    }),
    (0, class_validator_1.IsEnum)(enums_1.CharacterAvatarPreset),
    __metadata("design:type", String)
], CreateCharacterDto.prototype, "avatarPreset", void 0);
//# sourceMappingURL=create-character.dto.js.map