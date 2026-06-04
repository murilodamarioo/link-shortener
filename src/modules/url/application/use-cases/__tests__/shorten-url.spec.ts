import { InvalidSlugError, InvalidUrlError, SlugAlreadyTakenError } from '@/modules/url/domain/errors'

import { ShortenUrlUseCase } from '../shorten-url.use-case'

import { InMemoryUrlsRepository } from '@test/repositories/in-memory-urls-repository'

describe('ShortenUrlUseCase', () => {
  let sut: ShortenUrlUseCase
  let urlsRepository: InMemoryUrlsRepository

  beforeEach(() => {
    urlsRepository = new InMemoryUrlsRepository()
    sut = new ShortenUrlUseCase(urlsRepository)
  })

  it('should shorten a URL and return the entity', async () => {
    const response = await sut.execute({
      originalUrl: 'https://www.twitch.tv',
      slug: 'purple-tv'
    })

    expect(response.isSuccess()).toBe(true)
    expect(response.value).toBeDefined()
  })

  it('should persist the url in the repository', async () => {
    await sut.execute({
      originalUrl: 'https://www.twitch.tv',
      slug: 'purple-tv'
    })

    const urlOnDatabase = await urlsRepository.findBySlug('purple-tv')
    expect(urlOnDatabase).toBeDefined()
  })

  it('should use the custom slug when provided', async () => {
    const response = await sut.execute({
      originalUrl: 'https://www.twitch.tv',
      slug: 'my-custom-slug'
    })

    expect(response.isSuccess()).toBe(true)

    if (response.isSuccess()) {
      expect(response.value.url.slug).toBe('my-custom-slug')
    }
  })

  it('should fail when the custom slug is already taken', async () => {
    await sut.execute({
      originalUrl: 'https://www.google.com',
      slug: 'taken-slug'
    })

    const response = await sut.execute({
      originalUrl: 'https://www.example.com',
      slug: 'taken-slug'
    })

    expect(response.isFailure()).toBe(true)
    expect(response.value).toBeInstanceOf(SlugAlreadyTakenError)
  })

  it('should fail when the original URL is invalid', async () => {
    const response = await sut.execute({
      originalUrl: 'invalid-url'
    })

    expect(response.isFailure()).toBe(true)
    expect(response.value).toBeInstanceOf(InvalidUrlError)
  })

  it('should fail when the custom slug is invalid', async () => {
    const response = await sut.execute({
      originalUrl: 'https://www.example.com',
      slug: 'invalid Slug'
    })

    expect(response.isFailure()).toBe(true)
    expect(response.value).toBeInstanceOf(InvalidSlugError)
  })

  it('should set expiresAt when provided', async () => {
    const ONE_HOUR_FROM_NOW = new Date(Date.now() + 1000 * 60 * 60)

    const response = await sut.execute({
      originalUrl: 'https://www.example.com',
      expiresAt: ONE_HOUR_FROM_NOW
    })

    expect(response.isSuccess()).toBe(true)

    if (response.isSuccess()) {
      expect(response.value.url.expiresAt).toEqual(ONE_HOUR_FROM_NOW)
    }
  })
})
