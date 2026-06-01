type NodeEnv = 'development' | 'production' | 'test'

export interface AppConfig {
  app: {
    nodeEnv: NodeEnv
    port: number
    baseUrl: string
  }
  database: {
    url: string
  }
  redis: {
    host: string
    port: number
    ttlSeconds: number
  }
  jwt: {
    privateKey: string
    publicKey: string
    expiresIn: string
  }
  throttler: {
    ttl: number
    limit: number
  }
}