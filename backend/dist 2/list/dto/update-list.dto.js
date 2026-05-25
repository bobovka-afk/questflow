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
exports.UpdateListDto = void 0;
const class_validator_1 = require("class-validator");
const enums_1 = require("../../generated/prisma/enums");
const swagger_1 = require("@nestjs/swagger");
class UpdateListDto {
    name;
    colorPreset;
}
exports.UpdateListDto = UpdateListDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Done',
        description: 'Updated list name',
        minLength: 3,
        maxLength: 50,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateListDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: enums_1.ListColorPreset,
        example: enums_1.ListColorPreset.GREEN,
        description: 'Color preset for the list',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.ListColorPreset),
    __metadata("design:type", String)
], UpdateListDto.prototype, "colorPreset", void 0);
//# sourceMappingURL=update-list.dto.js.map