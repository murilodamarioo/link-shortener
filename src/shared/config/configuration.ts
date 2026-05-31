import { Env } from './env.validation';

export default () => {
  const env = process.env as unknown as Env;

  return {
    app: {
      nodeEnv: env.NODE_ENV,
      port: env.PORT,
      baseUrl: env.APP_BASE_URL,
    },

    database: {
      url: env.DATABASE_URL,
    },

    redis: {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      ttlSeconds: env.REDIS_TTL_SECONDS,
    },

    jwt: {
      privateKey: Buffer.from(env.JWT_PRIVATE_KEY, 'base64').toString('utf-8'),
      publicKey: Buffer.from(env.JWT_PUBLIC_KEY, 'base64').toString('utf-8'),
      expiresIn: env.JWT_EXPIRES_IN,
    },

    throttler: {
      ttl: env.THROTTLER_TTL,
      limit: env.THROTTLER_LIMIT,
    },
  };
};
