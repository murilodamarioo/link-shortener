import { Injectable } from '@nestjs/common'

import { CacheRepository } from '../cache.repository'
import { RedisService } from './redis.service'

import { EnvService } from '@/shared/env/env.service'

@Injectable()
export class RedisRepository implements CacheRepository {

  constructor(
    private env: EnvService,
    private redis: RedisService
  ) { }

  async get(key: string): Promise<string | null> {
    const value = await this.redis.get(key)

    return value
  }

  async set(key: string, value: string): Promise<void> {
    const ttl = this.env.get('REDIS_TTL_SECONDS')

    await this.redis.set(key, value, 'EX', ttl)
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key)
  }

}