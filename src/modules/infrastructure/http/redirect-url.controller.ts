import {
  BadRequestException,
  Controller,
  Get,
  GoneException,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Res
} from '@nestjs/common'
import { Response } from 'express'

import z from 'zod'

import { UrlExpiredError, UrlNotFoundError } from '@/modules/url/domain/errors'

import { RedirectUrlUseCase } from '@/modules/url/application/use-cases/redirect-url.use-case'

@Controller('/urls/:slug')
export class RedirectUrlController {

  constructor(private redirectUrl: RedirectUrlUseCase) { }


  @Get()
  @HttpCode(HttpStatus.FOUND)
  async handle(
    @Param('slug') slug: string,
    @Res() res: Response
  ) {
    const response = await this.redirectUrl.execute({ slug })

    if (response.isFailure()) {
      const error = response.value

      switch (response.constructor) {
        case UrlNotFoundError:
          throw new NotFoundException(error.message)
        case UrlExpiredError:
          throw new GoneException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { originalUrl } = response.value

    return res.redirect(HttpStatus.FOUND, originalUrl)
  }
}