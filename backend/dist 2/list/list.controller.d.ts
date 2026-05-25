import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { MoveListDto } from './dto/move-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import type { List } from '../generated/prisma/client';
export declare class ListController {
    private readonly listService;
    constructor(listService: ListService);
    getLists(boardId: number): Promise<List[]>;
    createList(boardId: number, dto: CreateListDto): Promise<List>;
    moveList(listId: any, dto: MoveListDto): Promise<List | null>;
    updateList(listId: number, dto: UpdateListDto): Promise<List>;
    deleteList(listId: number): Promise<{
        ok: boolean;
    }>;
}
