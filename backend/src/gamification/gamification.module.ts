import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { GamificationCronService } from './gamification-cron.service';

@Module({
  imports: [PrismaModule],
  providers: [GamificationCronService],
  exports: [GamificationCronService],
})
export class GamificationModule {}
