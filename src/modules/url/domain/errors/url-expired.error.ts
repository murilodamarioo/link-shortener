import { DomainError } from '@/shared/core/errors/domain-error'

export class UrlExpiredError extends DomainError {
  constructor(url: string) {
    super(`The URL "${url}" has expired.`)
  }
}