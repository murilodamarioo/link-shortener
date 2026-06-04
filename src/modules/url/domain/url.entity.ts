import { OriginalUrl } from './value-objects/original-url'
import { Slug } from './value-objects/slug'

import { InvalidUrlError } from './errors/invalid-url.error'
import { InvalidSlugError } from './errors/invalid-slug.error'

import { Entity } from '@/shared/core/entity'
import { Either, failure, success } from '@/shared/core/either'
import { UniqueEntityId } from '@/shared/core/unique-entity-id'

export interface UrlProps {
  originalUrl: OriginalUrl
  slug: Slug
  isActive: boolean
  createdAt: Date
  expiresAt?: Date
}

interface CreateUrlInput {
  originalUrl: string
  customSlug?: string
  expiresAt?: Date
}

type CreateUrlResult = Either<InvalidUrlError | InvalidSlugError, Url>

export class Url extends Entity<UrlProps> {

  get originalUrl(): string {
    return this.props.originalUrl.url
  }

  get slug(): string {
    return this.props.slug.slug
  }

  get isActive(): boolean {
    return this.props.isActive
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get expiresAt(): Date | undefined {
    return this.props.expiresAt
  }

  public isExpired(): boolean {
    if (!this.props.expiresAt) return false
    return this.props.expiresAt < new Date()
  }

  public isAvailable(): boolean {
    return this.props.isActive && !this.isExpired()
  }

  public activate(): void {
    this.props.isActive = true
  }

  public deactivate(): void {
    this.props.isActive = false
  }

  public static create(input: CreateUrlInput, id?: UniqueEntityId): CreateUrlResult {
    const originalUrlOrError = OriginalUrl.create(input.originalUrl)

    if (originalUrlOrError.isFailure()) {
      return failure(originalUrlOrError.value)
    }

    const slugOrError = input.customSlug
      ? Slug.create(input.customSlug)
      : Slug.generate()

    if (slugOrError.isFailure()) {
      return failure(slugOrError.value)
    }

    return success(
      new Url(
        {
          originalUrl: originalUrlOrError.value,
          slug: slugOrError.value,
          isActive: true,
          createdAt: new Date(),
          expiresAt: input.expiresAt,
        },
        id
      )
    )
  }
}