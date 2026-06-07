import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z.string(),
  PORT: z.coerce.number().optional().default(3000),
  APP_BASE_URL: z.url(),
  DATABASE_URL: z.url(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number().optional().default(6379),
  REDIS_DB: z.coerce.number().optional().default(0),
  REDIS_TTL_SECONDS: z.coerce.number().optional().default(3600),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  JWT_EXPIRES_IN: z.string().default('7d'),
  THROTTLER_TTL: z.coerce.number().optional().default(60),
  THROTTLER_LIMIT: z.coerce.number().optional().default(100),
});

export type Env = z.infer<typeof envSchema>
