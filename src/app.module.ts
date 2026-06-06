import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { envSchema } from './shared/env/env'
import { EnvModule } from './shared/env/env.module'
import { DatabaseModule } from './shared/database/database.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: env => envSchema.parse(env),
      isGlobal: true
    }),
    EnvModule,
    DatabaseModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
