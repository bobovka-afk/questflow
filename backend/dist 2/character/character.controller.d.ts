import { CharacterService } from './character.service';
import type { AuthedRequest } from '../common/type';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import type { Character } from '../generated/prisma/client';
export declare class CharacterController {
    private readonly characterService;
    constructor(characterService: CharacterService);
    getCharacter(req: AuthedRequest): Promise<Character>;
    getCharacterByUserId(userId: number): Promise<Character>;
    createCharacter(req: AuthedRequest, dto: CreateCharacterDto): Promise<Character>;
    updateCharacter(req: AuthedRequest, dto: UpdateCharacterDto): Promise<Character>;
    dailyCheckin(req: AuthedRequest): Promise<import("../gamification/interface").XpGrantResult>;
}
