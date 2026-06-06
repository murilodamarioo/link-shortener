
import { Inject, Injectable } from '@nestjs/common'

import { InvalidSlugError, InvalidUrlError, SlugAlreadyTakenError } from '../../domain/errors'
import { IUrlsRepository, URLS_REPOSITORY } from '../../domain/repositories/urls.repository.interface'

import { Url } from '../../domain/url.entity'

import { Either, failure, success } from '@/shared/core/either'
import { Slug } from '../../domain/value-objects/slug'
import { OriginalUrl } from '../../domain/value-objects/original-url'

interface ShortenUrlRequest {
  originalUrl: string
  slug?: string
  expiresAt?: Date
}

type ShortenUrlResponse = Either<
  InvalidUrlError | InvalidSlugError | SlugAlreadyTakenError,
  { url: Url }
>

@Injectable()
export class ShortenUrlUseCase {

  constructor(
    @Inject(URLS_REPOSITORY)
    private urlsRepository: IUrlsRepository
  ) { }

  async execute({ originalUrl, slug, expiresAt }: ShortenUrlRequest): Promise<ShortenUrlResponse> {
    if (slug) {
      const invalidSlug = Slug.isValid(slug)

      const existingSlug = await this.urlsRepository.findBySlug(slug)

      if (existingSlug) {
        return failure(new SlugAlreadyTakenError(slug))
      } else if (!invalidSlug) {
        return failure(new InvalidSlugError(slug))
      }
    }

    const customSlug = slug ? Slug.create(slug) : Slug.generate()

    if (!OriginalUrl.isValid(originalUrl)) {
      return failure(new InvalidUrlError(originalUrl))
    }

    const url = Url.create({ originalUrl, customSlug, expiresAt })

    await this.urlsRepository.save(url)

    return success({ url: url })
  }

}