import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import type { Board } from '../generated/prisma/client';
import { BOARD_TEMPLATES, isBoardTemplateKey } from './lib/board-templates';

@Injectable()
export class BoardService {
  constructor(private readonly prisma: PrismaService) {}

  async createBoard(workspaceId: number, dto: CreateBoardDto): Promise<Board> {
    if (dto.template && !isBoardTemplateKey(dto.template)) {
      throw new BadRequestException({
        code: 'BOARD_TEMPLATE_INVALID',
        message: 'Invalid board template',
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const board = await tx.board.create({
        data: {
          name: dto.name,
          description: dto.description,
          position: dto.position ?? 0,
          workspaceId,
        },
      });

      const templateKey = dto.template ?? 'empty';
      const lists = BOARD_TEMPLATES[templateKey].lists;
      for (let i = 0; i < lists.length; i++) {
        await tx.list.create({
          data: {
            boardId: board.id,
            name: lists[i],
            position: i,
          },
        });
      }

      return board;
    });
  }

  async getBoard(boardId: number): Promise<Board> {
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      throw new NotFoundException({
        code: 'BOARD_NOT_FOUND',
        message: 'Board not found',
      });
    }

    return board;
  }

  async getBoards(
    workspaceId: number,
    includeArchived: boolean,
  ): Promise<Board[]> {
    return this.prisma.board.findMany({
      where: {
        workspaceId,
        ...(includeArchived ? {} : { archivedAt: null }),
      },
      orderBy: { position: 'asc' },
    });
  }

  async getArchivedBoards(workspaceId: number): Promise<Board[]> {
    return this.prisma.board.findMany({
      where: { workspaceId, archivedAt: { not: null } },
      orderBy: { archivedAt: 'desc' },
    });
  }

  async updateBoard(boardId: number, dto: UpdateBoardDto): Promise<Board> {
    if (
      dto.name === undefined &&
      dto.description === undefined &&
      dto.archived === undefined
    ) {
      throw new BadRequestException({
        code: 'BOARD_UPDATE_FIELDS_REQUIRED',
        message: 'Provide at least one field: name, description, or archived',
      });
    }

    const data: {
      name?: string;
      description?: string | null;
      archivedAt?: Date | null;
    } = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.archived === true) data.archivedAt = new Date();
    if (dto.archived === false) data.archivedAt = null;

    return this.prisma.board.update({
      where: { id: boardId },
      data,
    });
  }

  async deleteBoard(boardId: number): Promise<{ ok: boolean }> {
    await this.prisma.board.delete({
      where: { id: boardId },
    });
    return { ok: true };
  }
}
