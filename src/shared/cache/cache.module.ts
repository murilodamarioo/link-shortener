import { Module } from '@nestjs/common'

import { CacheRepository } from './cache.repository'
import { RedisService } from './redis/redis.service'
import { RedisRepository } from './redis/redis.repository'

import { EnvModule } from '../env/env.module'

@Module({
  imports: [EnvModule],
  providers: [
    RedisService,
    {
      provide: CacheRepository,
      useClass: RedisRepository
    }
  ],
  exports: [CacheRepository]
})
export class CacheModule { }