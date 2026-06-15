import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

import { ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { ZodSchema } from 'zod/v4'

@Injectable()
export class ZodValidationPipe implements PipeTransform {

  constructor(private schema: ZodSchema) { }

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsed = this.schema.parse(value ?? {})
      return parsed
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          statusCode: 400,
          errors: fromZodError(error),
        })
      }

      throw new BadRequestException('Validation failed')
    }
  }
}