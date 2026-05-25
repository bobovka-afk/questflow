"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const user_module_1 = require("./user/user.module");
const auth_module_1 = require("./auth/auth.module");
const workspace_module_1 = require("./workspace/workspace.module");
const workspace_invite_module_1 = require("./workspace-invite/workspace-invite.module");
const board_module_1 = require("./board/board.module");
const list_module_1 = require("./list/list.module");
const card_module_1 = require("./card/card.module");
const comment_module_1 = require("./comment/comment.module");
const workspace_member_module_1 = require("./workspace-member/workspace-member.module");
const health_module_1 = require("./health/health.module");
const redis_module_1 = require("./redis/redis.module");
const nestjs_pino_1 = require("nestjs-pino");
const node_crypto_1 = require("node:crypto");
const character_module_1 = require("./character/character.module");
const schedule_1 = require("@nestjs/schedule");
const gamification_module_1 = require("./gamification/gamification.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true
            }),
            schedule_1.ScheduleModule.forRoot(),
            nestjs_pino_1.LoggerModule.forRoot({
                pinoHttp: {
                    autoLogging: false,
                    quietReqLogger: true,
                    quietResLogger: true,
                    genReqId: (req, res) => {
                        const incomingRequestId = req.headers['x-request-id'];
                        const requestId = Array.isArray(incomingRequestId)
                            ? incomingRequestId[0]
                            : incomingRequestId ?? (0, node_crypto_1.randomUUID)();
                        res.setHeader('X-Request-Id', requestId);
                        return requestId;
                    },
                    customProps: (req) => ({
                        requestId: req.id,
                    }),
                    serializers: {
                        req: (req) => ({
                            id: req.id,
                            method: req.method,
                            url: req.url,
                        }),
                        res: (res) => ({
                            statusCode: res.statusCode,
                        }),
                    },
                    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
                    transport: process.env.LOG_PRETTY === 'true' || process.env.NODE_ENV !== 'production'
                        ? {
                            target: 'pino-pretty',
                            options: {
                                singleLine: true,
                                colorize: true,
                                translateTime: 'SYS:standard',
                            },
                        }
                        : undefined,
                    redact: {
                        paths: [
                            'req.headers.authorization',
                            'req.headers.cookie',
                            'req.headers.x-api-key',
                            'req.body.password',
                            'req.body.token',
                            'req.body.refreshToken',
                            'res.headers["set-cookie"]',
                        ],
                        remove: true,
                    },
                },
            }),
            prisma_module_1.PrismaModule,
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            workspace_module_1.WorkspaceModule,
            workspace_invite_module_1.WorkspaceInviteModule,
            board_module_1.BoardModule,
            list_module_1.ListModule,
            card_module_1.CardModule,
            comment_module_1.CommentModule,
            workspace_member_module_1.WorkspaceMemberModule,
            health_module_1.HealthModule,
            redis_module_1.RedisModule,
            character_module_1.CharacterModule,
            gamification_module_1.GamificationModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map