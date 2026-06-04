
import { Inject, Injectable } from '@nestjs/common'

import { InvalidSlugError, InvalidUrlError, SlugAlreadyTakenError } from '../../domain/errors'
import { IUrlsRepository, URLS_REPOSITORY } from '../../domain/repositories/urls.repository.interface'

import { Url } from '../../domain/url.entity'

import { Either, failure, success } from '@/shared/core/either'

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
      const existingSlug = await this.urlsRepository.findBySlug(slug)

      if (existingSlug) {
        return failure(new SlugAlreadyTakenError(slug))
      }
    }

    const url = Url.create({ originalUrl, customSlug: slug, expiresAt })

    if (url.isFailure()) {
      return failure(url.value)
    }

    await this.urlsRepository.save(url.value)

    return success({ url: url.value })
  }

}