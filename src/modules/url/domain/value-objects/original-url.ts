import { ValueObject } from '@/shared/core/value-object'
import { Either, failure, success } from '@/shared/core/either'

import { InvalidUrlError } from '@/modules/url/domain/errors/invalid-url.error'

interface OriginalUrlProps {
  url: string
}

type CreateOriginalUrlResult = Either<InvalidUrlError, OriginalUrl>

export class OriginalUrl extends ValueObject<OriginalUrlProps> {
  get url(): string {
    return this.props.url
  }

  private static isValid(url: string): boolean {
    try {
      const parsed = new URL(url)
      return parsed.protocol === 'http:' || parsed.protocol === 'https:'
    } catch {
      return false
    }
  }

  public static create(url: string): CreateOriginalUrlResult {
    if (!this.isValid(url)) {
      return failure(new InvalidUrlError(url))
    }

    return success(new OriginalUrl({ url }))
  }
}