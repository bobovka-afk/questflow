import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CharacterService } from '../character/character.service';
import { resolveCardRewardUserId } from '../gamification/core/card-reward-user';
import { QuestProgressService } from '../gamification/quest/quest-progress.service';
import { AchievementService } from '../gamification/achievement/achievement.service';
import { AchievementMetric } from '../generated/prisma/enums';
import type { CardCompletionResult } from './interface';
import { CreateCardDto } from './dto/create-card.dto';
import { MoveCardDto } from './dto/move-card.dto';
import { SetCardCompletionDto } from './dto/set-card-completion.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import type { Card } from '../generated/prisma/client';
import { XpEventType } from '../generated/prisma/enums';
import { XP_PER_TASK_COMPLETED } from '../gamification/config/rewards';
import { NotificationService } from '../notification/notification.service';
import { UserNotificationType } from '../generated/prisma/enums';

@Injectable()
export class CardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly characterService: CharacterService,
    private readonly questProgressService: QuestProgressService,
    private readonly achievementService: AchievementService,
    private readonly notificationService: NotificationService,
  ) {}

  async getCards(listId: number) {
    const cards = await this.prisma.card.findMany({
      where: { listId },
      orderBy: { position: 'asc' },
      include: {
        labels: {
          select: {
            label: {
              select: { id: true, name: true, colorPreset: true },
            },
          },
        },
      },
    });
    return cards.map((c) => ({
      ...c,
      labels: c.labels.map((cl) => cl.label),
    }));
  }

  async createCard(listId: number, dto: CreateCardDto): Promise<Card> {
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

  async updateCard(
    cardId: number,
    dto: UpdateCardDto,
    actorUserId: number,
  ): Promise<Card> {
    if (
      dto.title === undefined &&
      dto.description === undefined &&
      dto.position === undefined &&
      dto.dueDate === undefined &&
      dto.assigneeId === undefined &&
      dto.reminderMinutesBefore === undefined
    ) {
      throw new BadRequestException({
        code: 'CARD_UPDATE_FIELDS_REQUIRED',
        message: 'Provide at least one field to update',
      });
    }

    const before =
      dto.assigneeId !== undefined
        ? await this.prisma.card.findUnique({
            where: { id: cardId },
            select: { assigneeId: true, title: true },
          })
        : null;

    const resetReminder =
      dto.dueDate !== undefined || dto.reminderMinutesBefore !== undefined;

    const updated = await this.prisma.card.update({
      where: { id: cardId },
      data: {
        title: dto.title,
        description: dto.description,
        position: dto.position,
        dueDate: dto.dueDate,
        assigneeId: dto.assigneeId,
        reminderMinutesBefore: dto.reminderMinutesBefore,
        ...(resetReminder ? { reminderNotifiedAt: null } : {}),
      },
    });

    if (
      dto.assigneeId != null &&
      dto.assigneeId !== before?.assigneeId &&
      dto.assigneeId !== actorUserId
    ) {
      await this.notificationService.create(
        dto.assigneeId,
        UserNotificationType.CARD_ASSIGNED,
        {
          cardId,
          title: updated.title ?? before?.title ?? null,
          assignedByUserId: actorUserId,
        },
      );
    }

    return updated;
  }

  async deleteCard(cardId: number): Promise<{ ok: boolean }> {
    await this.prisma.card.delete({
      where: { id: cardId },
    });
    return { ok: true };
  }

  async setCardCompletion(
    cardId: number,
    dto: SetCardCompletionDto,
    actorUserId: number,
  ): Promise<CardCompletionResult> {
    const card = await this.prisma.card.findUnique({
      where: { id: cardId },
      select: {
        assigneeId: true,
        isCompleted: true,
        dueDate: true,
        list: {
          select: {
            board: { select: { workspaceId: true } },
          },
        },
      },
    });
    if (!card) {
      throw new NotFoundException({
        code: 'CARD_NOT_FOUND',
        message: 'Card not found',
      });
    }

    await this.prisma.card.update({
      where: { id: cardId },
      data: { isCompleted: dto.isCompleted },
    });

    let rewards: CardCompletionResult['rewards'];
    if (dto.isCompleted && !card.isCompleted) {
      const xpUserId = resolveCardRewardUserId(card.assigneeId, actorUserId);
      const outcome = await this.characterService.addExperience(
        xpUserId,
        XP_PER_TASK_COMPLETED,
        XpEventType.TASK_COMPLETED,
        cardId,
      );
      rewards = outcome.rewards;

      await this.questProgressService.recordCardCompleted(xpUserId, {
        cardId,
        workspaceId: card.list.board.workspaceId,
        dueDate: card.dueDate,
      });
      await this.achievementService.recordIncrement(
        xpUserId,
        AchievementMetric.CARDS_COMPLETED_TOTAL,
        1,
      );
    }

    return { ok: true, rewards };
  }

  async moveCard(cardId: number, dto: MoveCardDto): Promise<Card | null> {
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
        throw new NotFoundException({
          code: 'CARD_NOT_FOUND',
          message: 'Card not found',
        });
      }

      const targetList = await tx.list.findUnique({
        where: { id: dto.toListId },
        select: { id: true, boardId: true },
      });

      if (!targetList) {
        throw new NotFoundException({
          code: 'LIST_NOT_FOUND',
          message: 'Target list not found',
        });
      }

      if (targetList.boardId !== card.list.boardId) {
        throw new BadRequestException({
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
        const insertAt = Math.min(
          Math.max(0, dto.position),
          withoutMoved.length,
        );
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
      } else {
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
        const insertAt = Math.min(
          Math.max(0, dto.position),
          targetIds.length,
        );
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
}
