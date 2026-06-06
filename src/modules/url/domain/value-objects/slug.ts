import { ValueObject } from '@/shared/core/value-object'

import { InvalidSlugError } from '@/modules/url/domain/errors/invalid-slug.error'

interface SlugProps {
  slug: string
}

export class Slug extends ValueObject<SlugProps> {
  private static readonly REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/
  private static readonly MIN_LENGTH = 3
  private static readonly MAX_LENGTH = 50

  get slug(): string {
    return this.props.slug
  }

  static isValid(slug: string): boolean {
    return (
      slug.length >= this.MIN_LENGTH &&
      slug.length <= this.MAX_LENGTH &&
      this.REGEX.test(slug)
    )
  }

  public static create(slug: string): Slug {
    return new Slug({ slug })
  }

  public static generate(): Slug {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    const length = 8
    const slug = Array.from({ length })
      .map(() => chars[Math.floor(Math.random() * chars.length)])
      .join('')

    return this.create(slug)
  }
}