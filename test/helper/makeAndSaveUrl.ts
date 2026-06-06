import { Url } from '@/modules/url/domain/url.entity'
import { Slug } from '@/modules/url/domain/value-objects/slug'
import { InMemoryUrlsRepository } from '@test/repositories/in-memory-urls-repository'

interface MakeAndSaveUrlsParams {
  slug?: string
  expiresAt?: Date
  deactivate?: boolean
}

export async function makeAndSaveUrl(repository: InMemoryUrlsRepository, override: MakeAndSaveUrlsParams) {
  const result = Url.create({
    originalUrl: 'https://www.example.com',
    customSlug: override.slug ? Slug.create(override.slug) : Slug.generate(),
    expiresAt: override?.expiresAt
  })

  const url = result

  if (override?.deactivate) {
    url.deactivate()
  }

  await repository.save(url)

  return url
}