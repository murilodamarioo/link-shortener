import { DomainError } from '@/shared/core/errors/domain-error'

export class SlugAlreadyTakenError extends DomainError {
  constructor(slug: string) {
    super(`The slug "${slug}" is already taken.`)
  }
}