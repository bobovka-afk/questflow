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
exports.SendInviteDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const enums_1 = require("../../generated/prisma/enums");
const swagger_1 = require("@nestjs/swagger");
class SendInviteDto {
    email;
    role;
}
exports.SendInviteDto = SendInviteDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'member@example.com',
        description: 'Email of the invited user',
    }),
    (0, class_validator_1.IsEmail)({}),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value),
    __metadata("design:type", String)
], SendInviteDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: [enums_1.WorkspaceRole.ADMIN, enums_1.WorkspaceRole.MEMBER],
        example: enums_1.WorkspaceRole.MEMBER,
        description: 'Role to assign after invite acceptance',
    }),
    (0, class_validator_1.IsIn)([enums_1.WorkspaceRole.ADMIN, enums_1.WorkspaceRole.MEMBER]),
    __metadata("design:type", String)
], SendInviteDto.prototype, "role", void 0);
//# sourceMappingURL=send-invite.dto.js.map