import { DomainError } from '@/shared/core/errors/domain-error'

export class InvalidSlugError extends DomainError {
  constructor(slug: string) {
    super(`The slug "${slug}" is invalid.`)
  }
}