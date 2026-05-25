import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CharacterService } from './character.service';
import { CharacterController } from './character.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [CharacterController],
  providers: [CharacterService],
  exports: [CharacterService]
})
export class CharacterModule {}
