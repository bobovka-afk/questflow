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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const auth_guard_1 = require("../auth/guards/auth.guard");
const user_service_1 = require("./user.service");
const update_user_dto_1 = require("./dto/update-user.dto");
const fs = require("fs");
const multer_1 = require("multer");
const path = require("path");
const crypto_1 = require("crypto");
const rate_limit_decorator_1 = require("../common/decorators/rate-limit.decorator");
const rate_limit_guard_1 = require("../common/guards/rate-limit.guard");
const swagger_1 = require("@nestjs/swagger");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async getProfile(req) {
        return this.userService.getById(String(req.user.id));
    }
    async getUserProfile(req, userId) {
        return this.userService.getProfileForViewer(userId, req.user.id);
    }
    async updateProfile(req, body) {
        return this.userService.updateName(req.user.id, body.name);
    }
    async updateAvatar(req, file) {
        if (!file) {
            throw new common_1.BadRequestException({
                code: 'FILE_NOT_PROVIDED',
                message: 'File is not provided',
            });
        }
        const baseUrl = process.env.SERVER_URL ?? 'http://localhost:3000';
        const avatarUrl = `${baseUrl}/uploads/user-avatars/${file.filename}`;
        return this.userService.updateAvatar(req.user.id, avatarUrl);
    }
    async removeAvatar(req) {
        return this.userService.removeAvatar(req.user.id);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Current user profile returned successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('profile/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get another user profile (shared workspace required)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Public user profile returned successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "code: 'ACCESS_DENIED'" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "code: 'USER_NOT_FOUND'" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserProfile", null);
__decorate([
    (0, common_1.Patch)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Update current user profile' }),
    (0, swagger_1.ApiBody)({ type: update_user_dto_1.UpdateUserDto, description: 'User profile update payload' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Current user profile updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Patch)('update-avatar'),
    (0, common_1.UseGuards)(rate_limit_guard_1.RateLimitGuard),
    (0, rate_limit_decorator_1.RateLimit)({ key: 'user:update-avatar', limit: 10, windowSec: 300 }),
    (0, swagger_1.ApiOperation)({ summary: 'Upload and update user avatar' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['file'],
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Avatar image file',
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (_req, _file, cb) => {
                const dir = path.join(process.cwd(), 'uploads', 'user-avatars');
                fs.mkdirSync(dir, { recursive: true });
                cb(null, dir);
            },
            filename: (req, file, cb) => {
                const userId = req.user?.id ?? 'anon';
                const ext = path.extname(file.originalname).toLowerCase() || '.png';
                const name = `${userId}-${Date.now()}-${(0, crypto_1.randomUUID)()}${ext}`;
                cb(null, name);
            },
        }),
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (_req, file, cb) => {
            if (!file.mimetype.startsWith('image/')) {
                return cb(new common_1.BadRequestException({
                    code: 'IMAGE_FILE_REQUIRED',
                    message: 'Only image files are allowed',
                }), false);
            }
            cb(null, true);
        },
    })),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User avatar updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "code: 'IMAGE_FILE_REQUIRED'" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "code: 'FILE_NOT_PROVIDED'" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    (0, swagger_1.ApiResponse)({ status: 429, description: "code: 'RATE_LIMIT_EXCEEDED'" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateAvatar", null);
__decorate([
    (0, common_1.Delete)('remove-avatar'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove current user avatar' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User avatar removed successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "code: 'UNAUTHORIZED'" }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "removeAvatar", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('user'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map