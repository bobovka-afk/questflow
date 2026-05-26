import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { WorkspaceModule } from '../workspace/workspace.module';
import { CharacterModule } from '../character/character.module';
import { GamificationModule } from '../gamification/gamification.module';

@Module({
  imports: [PrismaModule, WorkspaceModule, CharacterModule, GamificationModule],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
