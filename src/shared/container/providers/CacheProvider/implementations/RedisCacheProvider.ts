import Redis, { Redis as RedisClient } from 'ioredis';
import { injectable } from 'inversify';
import { classToClass } from 'class-transformer';

import cacheConfig from '@config/cache';

import ICacheProvider from '../models/ICacheProvider';

@injectable()
class RedisCacheProvider implements ICacheProvider {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.redis);

    this.client.on('error', () =>
      console.log(
        '🚫 Something went wrong with Redis. Please, check connection',
      ),
    );
  }

  public async save(
    key: string,
    value: any,
    transform?: boolean,
  ): Promise<void> {
    await this.client.set(
      key,
      JSON.stringify(transform ? classToClass(value) : value),
    );
  }

  public async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) return null;

    return JSON.parse(data) as T;
  }

  public async invalidate(key: string): Promise<void> {
    const match = /(.)+:\*/g;

    if (key.match(match)) {
      const keys = await this.client.keys(key);

      const pipeline = this.client.pipeline();

      keys.forEach(k => {
        pipeline.del(k);
      });

      await pipeline.exec();
    } else {
      await this.client.del(key);
    }
  }
}

export default RedisCacheProvider;
