import { UrlExpiredError, UrlNotFoundError } from '@/modules/url/domain/errors'

import { RedirectUrlUseCase } from '../redirect-url.use-case'

import { makeAndSaveUrl } from '@test/helper/makeAndSaveUrl'
import { InMemoryUrlsRepository } from '@test/repositories/in-memory-urls-repository'

describe('RedirectUrlUseCase', () => {
  let sut: RedirectUrlUseCase
  let urlsRepository: InMemoryUrlsRepository

  beforeEach(() => {
    urlsRepository = new InMemoryUrlsRepository()
    sut = new RedirectUrlUseCase(urlsRepository)
  })

  it('should return the original URL for a valid slug', async () => {
    await makeAndSaveUrl(urlsRepository, { slug: 'my-link' })

    const response = await sut.execute({ slug: 'my-link' })

    expect(response.isSuccess()).toBe(true)

    if (response.isSuccess()) {
      expect(response.value.originalUrl).toBe('https://www.example.com')
    }
  })

  it('should fail when the slug does not exist', async () => {
    const response = await sut.execute({ slug: 'non-existent-slug' })

    expect(response.isFailure()).toBe(true)
    expect(response.value).toBeInstanceOf(UrlNotFoundError)
  })

  it('should fail when the URL is deactivated', async () => {
    await makeAndSaveUrl(urlsRepository, { slug: 'deactivated-link', deactivate: true })

    const response = await sut.execute({ slug: 'deactivated-link' })

    expect(response.isFailure()).toBe(true)
    expect(response.value).toBeInstanceOf(UrlNotFoundError)
  })

  it('should fail when the URL is expired', async () => {
    const ONE_HOUR_FROM_NOW = new Date(Date.now() - 1000 * 60 * 60)

    await makeAndSaveUrl(urlsRepository, { slug: 'expired-link', expiresAt: ONE_HOUR_FROM_NOW })

    const response = await sut.execute({ slug: 'expired-link' })

    expect(response.isFailure()).toBe(true)
    expect(response.value).toBeInstanceOf(UrlExpiredError)
  })

  it('should succeed when the URL has a future expiration date', async () => {
    const ONE_HOUR_FROM_NOW = new Date(Date.now() + 1000 * 60 * 60)

    await makeAndSaveUrl(urlsRepository, { slug: 'valid-link', expiresAt: ONE_HOUR_FROM_NOW })

    const response = await sut.execute({ slug: 'valid-link' })

    expect(response.isSuccess()).toBe(true)

    if (response.isSuccess()) {
      expect(response.value.originalUrl).toBe('https://www.example.com')
    }
  })
})