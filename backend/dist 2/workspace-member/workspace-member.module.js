"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceMemberModule = void 0;
const common_1 = require("@nestjs/common");
const workspace_member_service_1 = require("./workspace-member.service");
const workspace_member_controller_1 = require("./workspace-member.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const workspace_module_1 = require("../workspace/workspace.module");
const workspace_activity_module_1 = require("../workspace-activity/workspace-activity.module");
let WorkspaceMemberModule = class WorkspaceMemberModule {
};
exports.WorkspaceMemberModule = WorkspaceMemberModule;
exports.WorkspaceMemberModule = WorkspaceMemberModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, workspace_module_1.WorkspaceModule, workspace_activity_module_1.WorkspaceActivityModule],
        controllers: [workspace_member_controller_1.WorkspaceMemberController],
        providers: [workspace_member_service_1.WorkspaceMemberService],
    })
], WorkspaceMemberModule);
//# sourceMappingURL=workspace-member.module.js.map