import type { RedisOptions } from 'ioredis';

type RedisEnv = {
  REDIS_URL?: string;
  REDIS_HOST?: string;
  REDIS_PORT?: string;
  REDIS_PASSWORD?: string;
  REDISPASSWORD?: string;
};

export function resolveRedisOptions(
  env: RedisEnv = process.env as RedisEnv,
): RedisOptions | string {
  const redisUrl = env.REDIS_URL?.trim();
  if (redisUrl) {
    return redisUrl;
  }

  const host = env.REDIS_HOST ?? 'localhost';
  const port = Number(env.REDIS_PORT ?? 6379);
  const password = env.REDIS_PASSWORD ?? env.REDISPASSWORD;

  return {
    host,
    port,
    ...(password ? { password } : {}),
  };
}

export function resolveRedisMicroserviceOptions(
  env: RedisEnv = process.env as RedisEnv,
): { host: string; port: number; password?: string } {
  const resolved = resolveRedisOptions(env);

  if (typeof resolved === 'string') {
    const parsed = new URL(resolved);
    const password = parsed.password
      ? decodeURIComponent(parsed.password)
      : undefined;

    return {
      host: parsed.hostname,
      port: Number(parsed.port) || 6379,
      ...(password ? { password } : {}),
    };
  }

  return {
    host: resolved.host ?? 'localhost',
    port: resolved.port ?? 6379,
    ...(resolved.password ? { password: resolved.password } : {}),
  };
}
