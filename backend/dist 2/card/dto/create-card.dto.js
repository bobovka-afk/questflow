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
exports.CreateCardDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateCardDto {
    title;
    description;
    position;
    dueDate;
    assigneeId;
}
exports.CreateCardDto = CreateCardDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Implement workspace archive',
        description: 'Card title',
        minLength: 3,
        maxLength: 50,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateCardDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Allow owners to archive old workspaces without deleting data.',
        description: 'Card description',
        maxLength: 2000,
        nullable: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", Object)
], CreateCardDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 0,
        description: 'Card position within list',
        minimum: 0,
        maximum: 100000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100000),
    __metadata("design:type", Number)
], CreateCardDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '2026-04-10T12:00:00.000Z',
        description: 'Card due date in ISO format',
        nullable: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Object)
], CreateCardDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 7,
        description: 'Assignee user id',
        minimum: 1,
        nullable: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Object)
], CreateCardDto.prototype, "assigneeId", void 0);
//# sourceMappingURL=create-card.dto.js.map