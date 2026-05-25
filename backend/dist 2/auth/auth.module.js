"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const user_module_1 = require("../user/user.module");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const google_strategy_1 = require("./strategies/google.strategy");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const jwt_config_1 = require("../config/jwt.config");
const prisma_module_1 = require("../prisma/prisma.module");
const mail_module_1 = require("../mail/mail.module");
const redis_module_1 = require("../redis/redis.module");
const rate_limit_guard_1 = require("../common/guards/rate-limit.guard");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            user_module_1.UserModule,
            prisma_module_1.PrismaModule,
            mail_module_1.MailModule,
            redis_module_1.RedisModule,
            config_1.ConfigModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: jwt_config_1.getJwtConfig,
                inject: [config_1.ConfigService]
            })
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, google_strategy_1.GoogleStrategy, rate_limit_guard_1.RateLimitGuard],
        exports: [auth_service_1.AuthService]
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map