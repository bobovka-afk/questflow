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
exports.WorkspaceActivityService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WorkspaceActivityService = class WorkspaceActivityService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async record(db, input) {
        await db.workspaceActivity.create({
            data: {
                workspaceId: input.workspaceId,
                actorUserId: input.actorUserId,
                type: input.type,
                payload: input.payload,
            },
        });
    }
    async listByWorkspace(workspaceId, pagination) {
        return this.prisma.workspaceActivity.findMany({
            where: { workspaceId },
            select: {
                id: true,
                type: true,
                payload: true,
                createdAt: true,
                actor: {
                    select: { id: true, name: true, email: true },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: pagination.limit,
            skip: pagination.offset,
        });
    }
};
exports.WorkspaceActivityService = WorkspaceActivityService;
exports.WorkspaceActivityService = WorkspaceActivityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorkspaceActivityService);
//# sourceMappingURL=workspace-activity.service.js.map