import { ConfigService } from '@nestjs/config';
import { HealthService } from '../health.service';
import { PrismaService } from '../../prisma/prisma.service';

jest.mock('ioredis', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    connect: jest.fn().mockResolvedValue(undefined),
    ping: jest.fn().mockResolvedValue('PONG'),
    disconnect: jest.fn(),
  })),
}));

describe('HealthService', () => {
  let service: HealthService;
  let prisma: jest.Mocked<Pick<PrismaService, '$queryRaw'>>;
  let configService: { get: jest.Mock };

  beforeEach(() => {
    prisma = { $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]) };
    configService = {
      get: jest.fn((key: string) =>
        key === 'REDIS_HOST' ? 'localhost' : '6379',
      ),
    };
    service = new HealthService(
      prisma as unknown as PrismaService,
      configService as unknown as ConfigService,
    );
  });

  it('returns liveness payload', () => {
    const health = service.getHealth();
    expect(health.status).toBe('ok');
    expect(health.uptimeSeconds).toBeGreaterThanOrEqual(0);
  });

  it('returns ready when postgres and redis ok', async () => {
    const readiness = await service.getReadiness();
    expect(readiness.status).toBe('ready');
    expect(readiness.checks.postgres.ok).toBe(true);
    expect(readiness.checks.redis.ok).toBe(true);
  });

  it('returns not_ready when postgres fails', async () => {
    prisma.$queryRaw.mockRejectedValue(new Error('db down'));
    const readiness = await service.getReadiness();
    expect(readiness.status).toBe('not_ready');
    expect(readiness.checks.postgres.ok).toBe(false);
  });
});
