import { OriginalUrl } from './value-objects/original-url'
import { Slug } from './value-objects/slug'

import { Entity } from '@/shared/core/entity'
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
  customSlug: Slug
  expiresAt?: Date
}

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

  public static create(input: CreateUrlInput, id?: UniqueEntityId): Url {
    const originalUrl = OriginalUrl.create(input.originalUrl)
    
    return new Url(
      {
        originalUrl: originalUrl,
        slug: input.customSlug,
        isActive: true,
        createdAt: new Date(),
        expiresAt: input.expiresAt,
      },
      id
    )
  }
}