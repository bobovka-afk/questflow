"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceActivityModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const workspace_activity_service_1 = require("./workspace-activity.service");
const workspace_activity_controller_1 = require("./workspace-activity.controller");
const workspace_access_guard_1 = require("../common/guards/workspace-access.guard");
const workspace_role_guard_1 = require("../common/guards/workspace-role.guard");
let WorkspaceActivityModule = class WorkspaceActivityModule {
};
exports.WorkspaceActivityModule = WorkspaceActivityModule;
exports.WorkspaceActivityModule = WorkspaceActivityModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [workspace_activity_controller_1.WorkspaceActivityController],
        providers: [
            workspace_activity_service_1.WorkspaceActivityService,
            workspace_access_guard_1.WorkspaceAccessGuard,
            workspace_role_guard_1.WorkspaceRoleGuard,
        ],
        exports: [workspace_activity_service_1.WorkspaceActivityService],
    })
], WorkspaceActivityModule);
//# sourceMappingURL=workspace-activity.module.js.map