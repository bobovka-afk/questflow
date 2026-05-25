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
exports.BoardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BoardService = class BoardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createBoard(workspaceId, dto) {
        return this.prisma.board.create({
            data: {
                name: dto.name,
                description: dto.description,
                position: dto.position,
                workspaceId,
            },
        });
    }
    async getBoard(boardId) {
        const board = await this.prisma.board.findUnique({
            where: { id: boardId },
        });
        if (!board) {
            throw new common_1.NotFoundException({
                code: 'BOARD_NOT_FOUND',
                message: 'Board not found',
            });
        }
        return board;
    }
    async getBoards(workspaceId) {
        return this.prisma.board.findMany({
            where: {
                workspaceId: workspaceId,
            },
            orderBy: { position: 'asc' },
        });
    }
    async updateBoard(boardId, dto) {
        if (dto.name === undefined && dto.description === undefined) {
            throw new common_1.BadRequestException({
                code: 'BOARD_UPDATE_FIELDS_REQUIRED',
                message: 'Provide at least one field: name or description',
            });
        }
        return this.prisma.board.update({
            where: { id: boardId },
            data: {
                name: dto.name,
                description: dto.description,
            },
        });
    }
    async deleteBoard(boardId) {
        await this.prisma.board.delete({
            where: { id: boardId },
        });
        return { ok: true };
    }
};
exports.BoardService = BoardService;
exports.BoardService = BoardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BoardService);
//# sourceMappingURL=board.service.js.map