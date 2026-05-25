import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

const mockIncr = jest.fn();
const mockExpire = jest.fn();

jest.mock('ioredis', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    incr: mockIncr,
    expire: mockExpire,
  })),
}));

describe('RedisService', () => {
  beforeEach(() => {
    mockIncr.mockReset();
    mockExpire.mockReset();
  });

  it('sets TTL on first increment', async () => {
    const configService = {
      get: jest.fn((key: string) =>
        key === 'REDIS_HOST' ? 'localhost' : '6379',
      ),
    };
    const service = new RedisService(
      configService as unknown as ConfigService,
    );
    mockIncr.mockResolvedValue(1);
    const count = await service.incrementWithTtl('key', 30);
    expect(count).toBe(1);
    expect(mockExpire).toHaveBeenCalledWith('key', 30);
  });

  it('exposes redis client', () => {
    const configService = { get: jest.fn(() => 'localhost') };
    const service = new RedisService(
      configService as unknown as ConfigService,
    );
    expect(service.getClient()).toBeDefined();
  });

  it('skips TTL when key already exists', async () => {
    const configService = {
      get: jest.fn(() => 'localhost'),
    };
    const service = new RedisService(
      configService as unknown as ConfigService,
    );
    mockIncr.mockResolvedValue(2);
    await service.incrementWithTtl('key', 30);
    expect(mockExpire).not.toHaveBeenCalled();
  });
});
