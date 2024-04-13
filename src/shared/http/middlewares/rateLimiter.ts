import AppError from '@shared/errors/AppError';
import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import redisConfig from '@config/redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const redis = new Redis(redisConfig.config.redis);

    const limiter = new RateLimiterRedis({
      storeClient: redis,
      keyPrefix: 'ratelimit',
      points: 5,
      duration: 1,
    });

    await limiter.consume(request.ip as string);

    return next();
  } catch (err) {
    throw new AppError('Too many requests', 429);
  }
}
