import { ExecutionContext, HttpException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RateLimitGuard } from './rate-limit.guard';
import { RedisService } from '../../redis/redis.service';
import { RATE_LIMIT_KEY } from '../decorators/rate-limit.decorator';

describe('RateLimitGuard', () => {
  let guard: RateLimitGuard;
  let reflector: jest.Mocked<Pick<Reflector, 'get'>>;
  let redisService: jest.Mocked<Pick<RedisService, 'incrementWithTtl'>>;

  const context = {
    getHandler: () => ({}),
    switchToHttp: () => ({
      getRequest: () => ({ user: { id: 1 }, ip: '127.0.0.1' }),
    }),
  } as unknown as ExecutionContext;

  beforeEach(() => {
    reflector = { get: jest.fn() };
    redisService = { incrementWithTtl: jest.fn() };
    guard = new RateLimitGuard(
      reflector as unknown as Reflector,
      redisService as unknown as RedisService,
    );
  });

  it('allows when no rate limit metadata', async () => {
    reflector.get.mockReturnValue(undefined);
    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('allows under limit', async () => {
    reflector.get.mockReturnValue({ key: 'login', limit: 5, windowSec: 60 });
    redisService.incrementWithTtl.mockResolvedValue(3);
    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('blocks over limit', async () => {
    reflector.get.mockReturnValue({ key: 'login', limit: 5, windowSec: 60 });
    redisService.incrementWithTtl.mockResolvedValue(6);
    await expect(guard.canActivate(context)).rejects.toThrow(HttpException);
  });

  it('uses IP when user absent', async () => {
    reflector.get.mockReturnValue({ key: 'login', limit: 5, windowSec: 60 });
    redisService.incrementWithTtl.mockResolvedValue(1);
    const anonContext = {
      getHandler: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({ ip: '10.0.0.1' }),
      }),
    } as unknown as ExecutionContext;
    await guard.canActivate(anonContext);
    expect(redisService.incrementWithTtl).toHaveBeenCalledWith(
      'rate_limit:login:ip:10.0.0.1',
      60,
    );
  });
});
