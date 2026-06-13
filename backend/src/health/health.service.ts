import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { PrismaService } from '../prisma/prisma.service';
import { resolveRedisOptions } from '../redis/redis-connection';
import type { HealthLiveness, HealthReadiness } from './interface';
import type { ReadinessProbe } from './type';

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  getHealth(): HealthLiveness {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
    };
  }

  async getReadiness(): Promise<HealthReadiness> {
    const postgres = await this.checkPostgres();
    const redis = await this.checkRedis();
    const ready = postgres.ok && redis.ok;

    return {
      status: ready ? 'ready' : 'not_ready',
      checks: {
        postgres,
        redis,
      },
      timestamp: new Date().toISOString(),
    };
  }

  private async checkPostgres(): Promise<ReadinessProbe> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown PostgreSQL error',
      };
    }
  }

  private async checkRedis(): Promise<ReadinessProbe> {
    const probeOptions = {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
    } as const;
    const connection = resolveRedisOptions({
      REDIS_URL: this.configService.get<string>('REDIS_URL'),
      REDIS_HOST: this.configService.get<string>('REDIS_HOST'),
      REDIS_PORT: this.configService.get<string>('REDIS_PORT'),
      REDIS_PASSWORD: this.configService.get<string>('REDIS_PASSWORD'),
      REDISPASSWORD: this.configService.get<string>('REDISPASSWORD'),
    });
    const redis =
      typeof connection === 'string'
        ? new Redis(connection, probeOptions)
        : new Redis({ ...connection, ...probeOptions });

    try {
      await redis.connect();
      const result = await redis.ping();
      return { ok: result === 'PONG' };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown Redis error',
      };
    } finally {
      redis.disconnect();
    }
  }
}
