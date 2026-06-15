import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { envSchema } from './shared/env/env'
import { EnvModule } from './shared/env/env.module'

import { UrlModule } from './modules/url/application/use-cases/url.module'
import { HttpModule } from './modules/infrastructure/http/http.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: env => envSchema.parse(env),
      isGlobal: true
    }),
    EnvModule,
    UrlModule,
    HttpModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
