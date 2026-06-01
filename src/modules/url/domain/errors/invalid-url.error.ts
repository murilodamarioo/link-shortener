import { DomainError } from '@/shared/core/errors/domain-error'

export class InvalidUrlError extends DomainError {
  constructor(url: string) {
    super(`The URL "${url}" is invalid.`)
  }
}