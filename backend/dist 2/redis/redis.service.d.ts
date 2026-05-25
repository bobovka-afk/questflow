import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
export declare class RedisService {
    private readonly configService;
    private readonly client;
    constructor(configService: ConfigService);
    incrementWithTtl(key: string, ttlSeconds: number): Promise<number>;
    getClient(): Redis;
}
