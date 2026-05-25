"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceModule = void 0;
const common_1 = require("@nestjs/common");
const workspace_service_1 = require("./workspace.service");
const workspace_controller_1 = require("./workspace.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const workspace_activity_module_1 = require("../workspace-activity/workspace-activity.module");
const workspace_access_guard_1 = require("../common/guards/workspace-access.guard");
const workspace_role_guard_1 = require("../common/guards/workspace-role.guard");
const workspace_resource_guard_1 = require("../common/guards/workspace-resource.guard");
const workspace_context_resolver_1 = require("../common/services/workspace-context.resolver");
let WorkspaceModule = class WorkspaceModule {
};
exports.WorkspaceModule = WorkspaceModule;
exports.WorkspaceModule = WorkspaceModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, workspace_activity_module_1.WorkspaceActivityModule],
        controllers: [workspace_controller_1.WorkspaceController],
        providers: [
            workspace_service_1.WorkspaceService,
            workspace_access_guard_1.WorkspaceAccessGuard,
            workspace_role_guard_1.WorkspaceRoleGuard,
            workspace_resource_guard_1.WorkspaceResourceGuard,
            workspace_context_resolver_1.WorkspaceContextResolver,
        ],
        exports: [
            workspace_service_1.WorkspaceService,
            workspace_access_guard_1.WorkspaceAccessGuard,
            workspace_role_guard_1.WorkspaceRoleGuard,
            workspace_resource_guard_1.WorkspaceResourceGuard,
            workspace_context_resolver_1.WorkspaceContextResolver,
        ],
    })
], WorkspaceModule);
//# sourceMappingURL=workspace.module.js.map