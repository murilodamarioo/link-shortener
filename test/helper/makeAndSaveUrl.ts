import { Url } from '@/modules/url/domain/url.entity'
import { InMemoryUrlsRepository } from '@test/repositories/in-memory-urls-repository'

interface MakeAndSaveUrlsParams {
  slug?: string
  expiresAt?: Date
  deactivate?: boolean
}

export async function makeAndSaveUrl(repository: InMemoryUrlsRepository, override: MakeAndSaveUrlsParams) {
  const result = Url.create({
    originalUrl: 'https://www.example.com',
    customSlug: override?.slug ?? 'test-slug',
    expiresAt: override?.expiresAt
  })

  if (result.isFailure()) {
    throw new Error('Failed to create URL in test helper')
  }

  const url = result.value

  if (override?.deactivate) {
    url.deactivate()
  }

  await repository.save(url)
  
  return url
}