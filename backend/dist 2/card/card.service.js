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
exports.CardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const character_service_1 = require("../character/character.service");
const enums_1 = require("../generated/prisma/enums");
const rewards_1 = require("../gamification/config/rewards");
let CardService = class CardService {
    prisma;
    characterService;
    constructor(prisma, characterService) {
        this.prisma = prisma;
        this.characterService = characterService;
    }
    async getCards(listId) {
        return this.prisma.card.findMany({
            where: { listId },
            orderBy: { position: 'asc' },
        });
    }
    async createCard(listId, dto) {
        return this.prisma.card.create({
            data: {
                listId,
                title: dto.title,
                description: dto.description,
                position: dto.position,
                dueDate: dto.dueDate,
                assigneeId: dto.assigneeId,
            },
        });
    }
    async updateCard(cardId, dto) {
        if (dto.title === undefined &&
            dto.description === undefined &&
            dto.position === undefined &&
            dto.dueDate === undefined &&
            dto.assigneeId === undefined) {
            throw new common_1.BadRequestException({
                code: 'CARD_UPDATE_FIELDS_REQUIRED',
                message: 'Provide at least one field to update',
            });
        }
        return this.prisma.card.update({
            where: { id: cardId },
            data: {
                title: dto.title,
                description: dto.description,
                position: dto.position,
                dueDate: dto.dueDate,
                assigneeId: dto.assigneeId,
            },
        });
    }
    async deleteCard(cardId) {
        await this.prisma.card.delete({
            where: { id: cardId },
        });
        return { ok: true };
    }
    async setCardCompletion(cardId, dto, actorUserId) {
        const card = await this.prisma.card.findUnique({
            where: { id: cardId },
            select: { assigneeId: true, isCompleted: true },
        });
        if (!card) {
            throw new common_1.NotFoundException({
                code: 'CARD_NOT_FOUND',
                message: 'Card not found',
            });
        }
        await this.prisma.card.update({
            where: { id: cardId },
            data: { isCompleted: dto.isCompleted },
        });
        let rewards;
        if (dto.isCompleted && !card.isCompleted) {
            const xpUserId = card.assigneeId ?? actorUserId;
            const outcome = await this.characterService.addExperience(xpUserId, rewards_1.XP_PER_TASK_COMPLETED, enums_1.XpEventType.TASK_COMPLETED, cardId);
            rewards = outcome.rewards;
        }
        return { ok: true, rewards };
    }
    async moveCard(cardId, dto) {
        return this.prisma.$transaction(async (tx) => {
            const card = await tx.card.findUnique({
                where: { id: cardId },
                select: {
                    id: true,
                    listId: true,
                    list: { select: { boardId: true } },
                },
            });
            if (!card) {
                throw new common_1.NotFoundException({
                    code: 'CARD_NOT_FOUND',
                    message: 'Card not found',
                });
            }
            const targetList = await tx.list.findUnique({
                where: { id: dto.toListId },
                select: { id: true, boardId: true },
            });
            if (!targetList) {
                throw new common_1.NotFoundException({
                    code: 'LIST_NOT_FOUND',
                    message: 'Target list not found',
                });
            }
            if (targetList.boardId !== card.list.boardId) {
                throw new common_1.BadRequestException({
                    code: 'CARD_MOVE_CROSS_BOARD',
                    message: 'Cannot move card to a list on another board',
                });
            }
            const sourceListId = card.listId;
            const toListId = dto.toListId;
            const sourceCards = await tx.card.findMany({
                where: { listId: sourceListId },
                orderBy: { position: 'asc' },
                select: { id: true },
            });
            const targetCards = await tx.card.findMany({
                where: { listId: toListId },
                orderBy: { position: 'asc' },
                select: { id: true },
            });
            if (sourceListId === toListId) {
                const withoutMoved = sourceCards
                    .map((c) => c.id)
                    .filter((id) => id !== cardId);
                const insertAt = Math.min(Math.max(0, dto.position), withoutMoved.length);
                const newOrder = [
                    ...withoutMoved.slice(0, insertAt),
                    cardId,
                    ...withoutMoved.slice(insertAt),
                ];
                for (let i = 0; i < newOrder.length; i++) {
                    await tx.card.update({
                        where: { id: newOrder[i] },
                        data: { position: i, listId: toListId },
                    });
                }
            }
            else {
                const sourceIds = sourceCards
                    .map((c) => c.id)
                    .filter((id) => id !== cardId);
                for (let i = 0; i < sourceIds.length; i++) {
                    await tx.card.update({
                        where: { id: sourceIds[i] },
                        data: { position: i },
                    });
                }
                const targetIds = targetCards
                    .map((c) => c.id)
                    .filter((id) => id !== cardId);
                const insertAt = Math.min(Math.max(0, dto.position), targetIds.length);
                const newTargetOrder = [
                    ...targetIds.slice(0, insertAt),
                    cardId,
                    ...targetIds.slice(insertAt),
                ];
                for (let i = 0; i < newTargetOrder.length; i++) {
                    await tx.card.update({
                        where: { id: newTargetOrder[i] },
                        data: { position: i, listId: toListId },
                    });
                }
            }
            return tx.card.findUnique({ where: { id: cardId } });
        });
    }
};
exports.CardService = CardService;
exports.CardService = CardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        character_service_1.CharacterService])
], CardService);
//# sourceMappingURL=card.service.js.map