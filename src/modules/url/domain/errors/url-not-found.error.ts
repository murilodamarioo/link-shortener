import { DomainError } from '@/shared/core/errors/domain-error'

export class UrlNotFoundError extends DomainError {
  constructor(url: string) {
    super(`The URL "${url}" was not found.`)
  }
}