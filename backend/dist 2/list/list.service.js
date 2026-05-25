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
exports.ListService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ListService = class ListService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getLists(boardId) {
        return this.prisma.list.findMany({
            where: { boardId },
            orderBy: { position: 'asc' },
        });
    }
    async createList(boardId, dto) {
        return this.prisma.list.create({
            data: {
                name: dto.name,
                boardId,
                position: dto.position,
            },
        });
    }
    async updateList(listId, dto) {
        if (dto.name === undefined && dto.colorPreset === undefined) {
            throw new common_1.BadRequestException({
                code: 'LIST_UPDATE_FIELDS_REQUIRED',
                message: 'Provide at least one field: name or colorPreset',
            });
        }
        return this.prisma.list.update({
            where: { id: listId },
            data: {
                name: dto.name,
                colorPreset: dto.colorPreset,
            },
        });
    }
    async deleteList(listId) {
        await this.prisma.list.delete({
            where: { id: listId },
        });
        return { ok: true };
    }
    async moveList(listId, dto) {
        return this.prisma.$transaction(async (tx) => {
            const list = await tx.list.findUnique({
                where: { id: listId },
                select: { id: true, boardId: true },
            });
            if (!list) {
                throw new common_1.NotFoundException({
                    code: 'LIST_NOT_FOUND',
                    message: 'List not found',
                });
            }
            const boardLists = await tx.list.findMany({
                where: { boardId: list.boardId },
                orderBy: { position: 'asc' },
                select: { id: true },
            });
            const ids = boardLists.map((l) => l.id);
            const withoutMoved = ids.filter((id) => id !== listId);
            const insertAt = Math.min(Math.max(0, dto.position), withoutMoved.length);
            const newOrder = [
                ...withoutMoved.slice(0, insertAt),
                listId,
                ...withoutMoved.slice(insertAt),
            ];
            for (let i = 0; i < newOrder.length; i++) {
                await tx.list.update({
                    where: { id: newOrder[i] },
                    data: { position: i },
                });
            }
            return tx.list.findUnique({ where: { id: listId } });
        });
    }
};
exports.ListService = ListService;
exports.ListService = ListService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ListService);
//# sourceMappingURL=list.service.js.map