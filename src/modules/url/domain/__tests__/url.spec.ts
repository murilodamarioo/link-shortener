import { Url } from '@/modules/url/domain/url.entity'
import { makeUrl } from '@test/factories/make-url'
import { Slug } from '../value-objects/slug'


describe('Url entity', () => {

  describe('create()', () => {
    it('should create a valid Url', () => {
      const newUrl = makeUrl({ originalUrl: 'https://www.twitch.tv' })

      expect(newUrl).toBeInstanceOf(Url)
      expect(newUrl.originalUrl).toBeDefined()
    })

    it('should auto-generate a slug when none is provided', () => {
      const newUrl = makeUrl({ originalUrl: 'https://www.twitch.tv' })

      expect(newUrl).toBeInstanceOf(Url)
      expect(newUrl.slug).toBeDefined()
    })

    it('should use the custom slug when provided', () => {
      const newUrl = makeUrl({
        originalUrl: 'https://www.twitch.tv',
        customSlug: Slug.create('my-custom-slug')
      })

      expect(newUrl).toBeInstanceOf(Url)
      expect(newUrl.slug).toBe('my-custom-slug')
    })

    it('should set isActive as true by default', () => {
      const newUrl = makeUrl()

      expect(newUrl.isActive).toBe(true)
    })

    it('should set createdAt on creation', () => {
      const newUrl = makeUrl()

      expect(newUrl.createdAt).toBeDefined()
    })
  })

  describe('isExpired()', () => {
    it('should not be expired when no expiresAt is set', () => {
      const newUrl = makeUrl({ expiresAt: undefined })

      expect(newUrl.isExpired()).toBe(false)
    })

    it('should be expired when expiresAt is in the past', () => {
      const pastDate = new Date(Date.now() - 1000)
      const newUrl = makeUrl({ expiresAt: pastDate })

      expect(newUrl.isExpired()).toBe(true)
    })

    it('should not be expired when expiresAt is in the future', () => {
      const futureDate = new Date(Date.now() + 2000)
      const newUrl = makeUrl({ expiresAt: futureDate })

      expect(newUrl.isExpired()).toBe(false)
    })
  })

  describe('isAvailable()', () => {
    it('should be available when active and not expired', () => {
      const futureDate = new Date(Date.now() + 2000)
      const newUrl = makeUrl({ expiresAt: futureDate })

      expect(newUrl.isAvailable()).toBe(true)
    })

    it('should not be available when expired', () => {
      const pastDate = new Date(Date.now() - 1000)
      const newUrl = makeUrl({ expiresAt: pastDate })

      expect(newUrl.isAvailable()).toBe(false)
    })
  })

  describe('activate() / deactivate()', () => {
    it('should deactivate an active url', () => {
      const futureDate = new Date(Date.now() + 2000)
      const newUrl = makeUrl({ expiresAt: futureDate })

      newUrl.deactivate()

      expect(newUrl.isAvailable()).toBe(false)
    })

    it('should activate a deactivated url', () => {
      const newUrl = makeUrl({ expiresAt: undefined })
      newUrl.deactivate()

      expect(newUrl.isAvailable()).toBe(false)

      newUrl.activate()
      expect(newUrl.isAvailable()).toBe(true)
    })
  })

})