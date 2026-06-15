import { Module } from '@nestjs/common'

import { DatabaseModule } from '@/shared/database/database.module'
import { CacheModule } from '@/shared/cache/cache.module'

import { PrismaUrlsRepository } from '@/modules/infrastructure/prisma/repositories/prisma-urls.repository'

import { RedirectUrlUseCase } from './redirect-url.use-case'
import { ShortenUrlUseCase } from './shorten-url.use-case'

import { URLS_REPOSITORY } from '../../domain/repositories/urls.repository.interface'

@Module({
  imports: [DatabaseModule, CacheModule],
  providers: [
    {
      provide: URLS_REPOSITORY,
      useClass: PrismaUrlsRepository
    },
    RedirectUrlUseCase,
    ShortenUrlUseCase
  ],
  exports: [
    RedirectUrlUseCase,
    ShortenUrlUseCase
  ]
})
export class UrlModule { }