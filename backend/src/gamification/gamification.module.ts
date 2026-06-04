import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { GamificationCronService } from './cron/gamification-cron.service';
import { ChestService } from './chest/chest.service';
import { QuestProgressService } from './quest/quest-progress.service';
import { AchievementService } from './achievement/achievement.service';
import { DustService } from './dust/dust.service';
import { GamificationMetaController } from './gamification-meta.controller';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [PrismaModule, ConfigModule, NotificationModule],
  controllers: [GamificationMetaController],
  providers: [
    GamificationCronService,
    AchievementService,
    ChestService,
    DustService,
    QuestProgressService,
  ],
  exports: [
    GamificationCronService,
    AchievementService,
    ChestService,
    DustService,
    QuestProgressService,
  ],
})
export class GamificationModule {}
