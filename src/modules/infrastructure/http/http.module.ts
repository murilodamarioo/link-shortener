import { Module } from '@nestjs/common'

import { UrlModule } from '@/modules/url/application/use-cases/url.module'
import { EnvModule } from '@/shared/env/env.module'

import { ShortenUrlController } from './shorten-url.controller'
import { RedirectUrlController } from './redirect-url.controller'

@Module({
  imports: [UrlModule, EnvModule],
  controllers: [
    ShortenUrlController,
    RedirectUrlController
  ]
})
export class HttpModule { }