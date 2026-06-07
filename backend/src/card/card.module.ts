import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { CardAttachmentService } from './card-attachment.service';
import { PrismaModule } from '../prisma/prisma.module';
import { WorkspaceModule } from '../workspace/workspace.module';
import { CharacterModule } from '../character/character.module';
import { GamificationModule } from '../gamification/gamification.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [PrismaModule, WorkspaceModule, CharacterModule, GamificationModule, NotificationModule],
  controllers: [CardController],
  providers: [CardService, CardAttachmentService],
})
export class CardModule {}
