"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceInviteModule = void 0;
const common_1 = require("@nestjs/common");
const workspace_invite_service_1 = require("./workspace-invite.service");
const workspace_invite_controller_1 = require("./workspace-invite.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const mail_module_1 = require("../mail/mail.module");
const workspace_module_1 = require("../workspace/workspace.module");
const workspace_activity_module_1 = require("../workspace-activity/workspace-activity.module");
const redis_module_1 = require("../redis/redis.module");
const rate_limit_guard_1 = require("../common/guards/rate-limit.guard");
let WorkspaceInviteModule = class WorkspaceInviteModule {
};
exports.WorkspaceInviteModule = WorkspaceInviteModule;
exports.WorkspaceInviteModule = WorkspaceInviteModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            mail_module_1.MailModule,
            workspace_module_1.WorkspaceModule,
            workspace_activity_module_1.WorkspaceActivityModule,
            redis_module_1.RedisModule,
        ],
        controllers: [workspace_invite_controller_1.WorkspaceInviteController],
        providers: [workspace_invite_service_1.WorkspaceInviteService, rate_limit_guard_1.RateLimitGuard],
    })
], WorkspaceInviteModule);
//# sourceMappingURL=workspace-invite.module.js.map