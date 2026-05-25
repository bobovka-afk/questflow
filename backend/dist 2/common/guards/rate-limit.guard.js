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
exports.RateLimitGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rate_limit_decorator_1 = require("../decorators/rate-limit.decorator");
const redis_service_1 = require("../../redis/redis.service");
let RateLimitGuard = class RateLimitGuard {
    reflector;
    redisService;
    constructor(reflector, redisService) {
        this.reflector = reflector;
        this.redisService = redisService;
    }
    async canActivate(context) {
        const options = this.reflector.get(rate_limit_decorator_1.RATE_LIMIT_KEY, context.getHandler());
        if (!options) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const actor = request.user?.id
            ? `user:${request.user.id}`
            : `ip:${request.ip}`;
        const redisKey = `rate_limit:${options.key}:${actor}`;
        const count = await this.redisService.incrementWithTtl(redisKey, options.windowSec);
        if (count > options.limit) {
            throw new common_1.HttpException({
                code: 'RATE_LIMIT_EXCEEDED',
                message: 'Too many requests.',
            }, common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        return true;
    }
};
exports.RateLimitGuard = RateLimitGuard;
exports.RateLimitGuard = RateLimitGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        redis_service_1.RedisService])
], RateLimitGuard);
//# sourceMappingURL=rate-limit.guard.js.map