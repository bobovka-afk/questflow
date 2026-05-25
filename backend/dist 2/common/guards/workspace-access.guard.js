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
exports.WorkspaceAccessGuard = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let WorkspaceAccessGuard = class WorkspaceAccessGuard {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canActivate(context) {
        const req = context
            .switchToHttp()
            .getRequest();
        const userId = req.user?.id;
        if (!userId) {
            throw new common_1.UnauthorizedException({
                code: 'UNAUTHORIZED',
                message: 'Unauthorized',
            });
        }
        const rawWorkspaceId = req.params?.workspaceId;
        const workspaceId = Number(rawWorkspaceId);
        if (!Number.isInteger(workspaceId)) {
            throw new common_1.BadRequestException({
                code: 'WORKSPACE_ID_REQUIRED',
                message: 'workspaceId route param is required',
            });
        }
        const workspace = await this.prisma.workspace.findUnique({
            where: { id: workspaceId },
            select: { id: true },
        });
        if (!workspace) {
            throw new common_1.NotFoundException({
                code: 'WORKSPACE_NOT_FOUND',
                message: 'Workspace not found',
            });
        }
        const member = await this.prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId,
                },
            },
            select: { userId: true },
        });
        if (!member) {
            throw new common_1.ForbiddenException({
                code: 'WORKSPACE_MEMBER_REQUIRED',
                message: 'You are not a member of this workspace.',
            });
        }
        req.workspaceId = workspaceId;
        return true;
    }
};
exports.WorkspaceAccessGuard = WorkspaceAccessGuard;
exports.WorkspaceAccessGuard = WorkspaceAccessGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorkspaceAccessGuard);
//# sourceMappingURL=workspace-access.guard.js.map