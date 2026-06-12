import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CharacterModule } from '../character/character.module';
import { GamificationModule } from '../gamification/gamification.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PersonalController } from './personal.controller';
import { PersonalRewardService } from './personal-reward.service';
import { PersonalService } from './personal.service';

@Module({
  imports: [PrismaModule, ConfigModule, CharacterModule, GamificationModule],
  controllers: [PersonalController],
  providers: [PersonalService, PersonalRewardService],
  exports: [PersonalService],
})
export class PersonalModule {}
