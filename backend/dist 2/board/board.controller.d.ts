import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import type { Board } from '../generated/prisma/client';
export declare class BoardController {
    private readonly boardService;
    constructor(boardService: BoardService);
    createBoard(workspaceId: number, dto: CreateBoardDto): Promise<Board>;
    getBoard(boardId: any): Promise<Board>;
    getBoards(workspaceId: number): Promise<Board[]>;
    updateBoard(boardId: number, dto: UpdateBoardDto): Promise<Board>;
    deleteBoard(boardId: number): Promise<{
        ok: boolean;
    }>;
}
