import { Inject, Injectable } from '@nestjs/common'

import { IUrlsRepository, URLS_REPOSITORY } from '../../domain/repositories/urls.repository.interface'
import { UrlExpiredError, UrlNotFoundError } from '../../domain/errors'

import { Either, failure, success } from '@/shared/core/either'

interface RedirectUrlRequest {
  slug: string
}

type RedirectUrlResponse = Either<
  UrlNotFoundError | UrlExpiredError,
  { originalUrl: string }
>

@Injectable()
export class RedirectUrlUseCase {

  constructor(
    @Inject(URLS_REPOSITORY)
    private urlsRepository: IUrlsRepository
  ) { }

  async execute({ slug }: RedirectUrlRequest): Promise<RedirectUrlResponse> {
    const url = await this.urlsRepository.findBySlug(slug)

    if (!url) {
      return failure(new UrlNotFoundError(slug))
    }

    if (!url.isAvailable()) {
      if (url.isExpired()) {
        return failure(new UrlExpiredError(slug))
      }
      return failure(new UrlNotFoundError(slug))
    }


    return success({ originalUrl: url.originalUrl })
  }
}