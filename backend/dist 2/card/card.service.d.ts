import { PrismaService } from '../prisma/prisma.service';
import { CharacterService } from '../character/character.service';
import type { CardCompletionResult } from './interface';
import { CreateCardDto } from './dto/create-card.dto';
import { MoveCardDto } from './dto/move-card.dto';
import { SetCardCompletionDto } from './dto/set-card-completion.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import type { Card } from '../generated/prisma/client';
export declare class CardService {
    private readonly prisma;
    private readonly characterService;
    constructor(prisma: PrismaService, characterService: CharacterService);
    getCards(listId: number): Promise<Card[]>;
    createCard(listId: number, dto: CreateCardDto): Promise<Card>;
    updateCard(cardId: number, dto: UpdateCardDto): Promise<Card>;
    deleteCard(cardId: number): Promise<{
        ok: boolean;
    }>;
    setCardCompletion(cardId: number, dto: SetCardCompletionDto, actorUserId: number): Promise<CardCompletionResult>;
    moveCard(cardId: number, dto: MoveCardDto): Promise<Card | null>;
}
