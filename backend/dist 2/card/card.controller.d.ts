import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { MoveCardDto } from './dto/move-card.dto';
import { SetCardCompletionDto } from './dto/set-card-completion.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import type { AuthedRequest } from '../common/type';
import type { Card } from '../generated/prisma/client';
export declare class CardController {
    private readonly cardService;
    constructor(cardService: CardService);
    getCards(listId: number): Promise<Card[]>;
    createCard(listId: number, dto: CreateCardDto): Promise<Card>;
    moveCard(cardId: number, dto: MoveCardDto): Promise<Card | null>;
    setCardCompletion(req: AuthedRequest, cardId: number, dto: SetCardCompletionDto): Promise<{
        ok: boolean;
    }>;
    updateCard(cardId: any, dto: UpdateCardDto): Promise<Card>;
    deleteCard(cardId: number): Promise<{
        ok: boolean;
    }>;
}
