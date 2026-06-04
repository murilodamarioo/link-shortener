import { faker } from '@faker-js/faker'

import { Url } from '@/modules/url/domain/url.entity'
import { UniqueEntityId } from '@/shared/core/unique-entity-id'

type MakeUrlOverride = {
  originalUrl?: string
  customSlug?: string
  expiresAt?: Date
}

export function makeUrl(override: MakeUrlOverride = {}, id?: UniqueEntityId) {
  const url = Url.create({
    originalUrl: faker.internet.url(),
    ...override
  }, id)

  if (url.isFailure()) {
    throw url.value
  }

  return url.value
}
