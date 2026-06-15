
import { BadRequestException, Body, ConflictException, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'

import z from 'zod'

import { ShortenUrlUseCase } from '@/modules/url/application/use-cases/shorten-url.use-case'
import { InvalidSlugError, InvalidUrlError, SlugAlreadyTakenError } from '@/modules/url/domain/errors'

import { ZodValidationPipe } from './pipes/zod-validation.pipe'

import { EnvService } from '@/shared/env/env.service'

const shortenUrlDto = z.object({
  originalUrl: z.url(),
  slug: z.string().optional(),
  expiresAt: z.date().optional()
})

type ShortenUrlDto = z.infer<typeof shortenUrlDto>

const validationPipe = new ZodValidationPipe(shortenUrlDto)

@Controller('shorten-url')
export class ShortenUrlController {

  constructor(
    private shortenUrl: ShortenUrlUseCase,
    private envService: EnvService
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async handle(@Body(validationPipe) body: ShortenUrlDto) {
    const { originalUrl, slug, expiresAt } = body

    const response = await this.shortenUrl.execute({ originalUrl, slug, expiresAt })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case InvalidUrlError:
          throw new BadRequestException(error.message)
        case InvalidSlugError:
          throw new BadRequestException(error.message)
        case SlugAlreadyTakenError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { url } = response.value

    const shortUrl = `${this.envService.get('APP_BASE_URL')}/${url.slug}`

    return {
      id: url.id.toString(),
      originalUrl: url.originalUrl,
      slug: url.slug,
      shortUrl,
      expiresAt: url.expiresAt,
      createdAt: url.createdAt
    }
  }

}