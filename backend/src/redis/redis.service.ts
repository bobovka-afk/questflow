import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { resolveRedisOptions } from './redis-connection';

@Injectable()
export class RedisService {
  private readonly client: Redis;

  constructor(private readonly configService: ConfigService) {
    const connection = resolveRedisOptions({
      REDIS_URL: this.configService.get<string>('REDIS_URL'),
      REDIS_HOST: this.configService.get<string>('REDIS_HOST'),
      REDIS_PORT: this.configService.get<string>('REDIS_PORT'),
      REDIS_PASSWORD: this.configService.get<string>('REDIS_PASSWORD'),
      REDISPASSWORD: this.configService.get<string>('REDISPASSWORD'),
    });
    this.client =
      typeof connection === 'string'
        ? new Redis(connection)
        : new Redis(connection);
  }

  async incrementWithTtl(key: string, ttlSeconds: number) {
    const count = await this.client.incr(key);

    if (count === 1) {
      await this.client.expire(key, ttlSeconds);
    }

    return count;
  }

  getClient() {
    return this.client;
  }
}