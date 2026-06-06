import { faker } from '@faker-js/faker'

import { Url } from '@/modules/url/domain/url.entity'
import { Slug } from '@/modules/url/domain/value-objects/slug'

import { UniqueEntityId } from '@/shared/core/unique-entity-id'

type MakeUrlOverride = {
  originalUrl?: string
  customSlug?: Slug
  expiresAt?: Date
}

export function makeUrl(override: MakeUrlOverride = {}, id?: UniqueEntityId) {
  const url = Url.create({
    originalUrl: faker.internet.url(),
    customSlug: Slug.create(faker.string.fromCharacters('abc', 10)),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    ...override
  }, id)

  return url
}
