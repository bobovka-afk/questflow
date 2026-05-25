import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import type { Board } from '../generated/prisma/client';
export declare class BoardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createBoard(workspaceId: number, dto: CreateBoardDto): Promise<Board>;
    getBoard(boardId: number): Promise<Board>;
    getBoards(workspaceId: number): Promise<Board[]>;
    updateBoard(boardId: number, dto: UpdateBoardDto): Promise<Board>;
    deleteBoard(boardId: number): Promise<{
        ok: boolean;
    }>;
}
