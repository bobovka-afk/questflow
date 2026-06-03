import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ListColorPreset } from '../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkspaceLabelDto } from './dto/create-workspace-label.dto';
import { UpdateWorkspaceLabelDto } from './dto/update-workspace-label.dto';

@Injectable()
export class WorkspaceLabelService {
  constructor(private readonly prisma: PrismaService) {}

  async list(workspaceId: number) {
    return this.prisma.workspaceLabel.findMany({
      where: { workspaceId },
      orderBy: { name: 'asc' },
    });
  }

  async create(workspaceId: number, dto: CreateWorkspaceLabelDto) {
    try {
      return await this.prisma.workspaceLabel.create({
        data: {
          workspaceId,
          name: dto.name.trim(),
          colorPreset: dto.colorPreset ?? ListColorPreset.GREEN,
        },
      });
    } catch (e: unknown) {
      if (
        e &&
        typeof e === 'object' &&
        'code' in e &&
        (e as { code: string }).code === 'P2002'
      ) {
        throw new ConflictException({
          code: 'LABEL_NAME_TAKEN',
          message: 'Label with this name already exists in workspace',
        });
      }
      throw e;
    }
  }

  async update(labelId: number, dto: UpdateWorkspaceLabelDto) {
    if (dto.name === undefined && dto.colorPreset === undefined) {
      throw new BadRequestException({
        code: 'LABEL_UPDATE_FIELDS_REQUIRED',
        message: 'Provide name or colorPreset',
      });
    }
    return this.prisma.workspaceLabel.update({
      where: { id: labelId },
      data: {
        name: dto.name?.trim(),
        colorPreset: dto.colorPreset,
      },
    });
  }

  async delete(labelId: number): Promise<{ ok: boolean }> {
    await this.prisma.workspaceLabel.delete({ where: { id: labelId } });
    return { ok: true };
  }

  async setCardLabels(cardId: number, labelIds: number[]): Promise<void> {
    const card = await this.prisma.card.findUnique({
      where: { id: cardId },
      select: {
        list: { select: { board: { select: { workspaceId: true } } } },
      },
    });
    if (!card) {
      throw new NotFoundException({
        code: 'CARD_NOT_FOUND',
        message: 'Card not found',
      });
    }
    const wsId = card.list.board.workspaceId;

    if (labelIds.length > 6) {
      throw new BadRequestException({
        code: 'CARD_LABEL_LIMIT',
        message: 'Maximum 6 labels per card',
      });
    }

    if (labelIds.length > 0) {
      const count = await this.prisma.workspaceLabel.count({
        where: { workspaceId: wsId, id: { in: labelIds } },
      });
      if (count !== labelIds.length) {
        throw new BadRequestException({
          code: 'LABEL_WORKSPACE_MISMATCH',
          message: 'Some labels do not belong to this workspace',
        });
      }
    }

    await this.prisma.$transaction([
      this.prisma.cardLabel.deleteMany({ where: { cardId } }),
      ...(labelIds.length > 0
        ? [
            this.prisma.cardLabel.createMany({
              data: labelIds.map((labelId) => ({ cardId, labelId })),
            }),
          ]
        : []),
    ]);
  }
}
