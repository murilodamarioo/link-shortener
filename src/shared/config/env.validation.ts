import * as Joi from 'joi';

export const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  APP_BASE_URL: Joi.string().uri().required(),
  DATABASE_URL: Joi.string().uri().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_TTL_SECONDS: Joi.number().default(3600),
  JWT_PRIVATE_KEY: Joi.string().base64().required(),
  JWT_PUBLIC_KEY: Joi.string().base64().required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  THROTTLER_TTL: Joi.number().default(60),
  THROTTLER_LIMIT: Joi.number().default(100),
});

export type Env = {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  APP_BASE_URL: string;
  DATABASE_URL: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_TTL_SECONDS: number;
  JWT_PRIVATE_KEY: string;
  JWT_PUBLIC_KEY: string;
  JWT_EXPIRES_IN: string;
  THROTTLER_TTL: number;
  THROTTLER_LIMIT: number;
};
