import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import type { HealthLiveness, HealthReadiness } from './interface';
export declare class HealthService {
    private readonly prisma;
    private readonly configService;
    constructor(prisma: PrismaService, configService: ConfigService);
    getHealth(): HealthLiveness;
    getReadiness(): Promise<HealthReadiness>;
    private checkPostgres;
    private checkRedis;
}
