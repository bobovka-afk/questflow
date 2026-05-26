import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CharacterService } from './character.service';
import { CharacterController } from './character.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { GamificationModule } from '../gamification/gamification.module';

@Module({
  imports: [PrismaModule, ConfigModule, GamificationModule],
  controllers: [CharacterController],
  providers: [CharacterService],
  exports: [CharacterService]
})
export class CharacterModule {}
