import { PrismaService } from '../prisma/prisma.service';
import { CreateListDto } from './dto/create-list.dto';
import { MoveListDto } from './dto/move-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import type { List } from '../generated/prisma/client';
export declare class ListService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getLists(boardId: number): Promise<List[]>;
    createList(boardId: number, dto: CreateListDto): Promise<List>;
    updateList(listId: number, dto: UpdateListDto): Promise<List>;
    deleteList(listId: number): Promise<{
        ok: boolean;
    }>;
    moveList(listId: number, dto: MoveListDto): Promise<List | null>;
}
