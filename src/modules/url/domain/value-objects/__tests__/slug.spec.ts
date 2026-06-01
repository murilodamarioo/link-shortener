import { Slug } from '../slug'

describe('Slug', () => {
  describe('valid slugs', () => {
    it('should create a valid slug', () => {
      const result = Slug.create('my-link')

      expect(result.isSuccess()).toBe(true)
    })

    it('should store the slug value', () => {
      const result = Slug.create('my-link')

      expect(result.isSuccess()).toBe(true)
      if (result.isSuccess()) {
        expect(result.value.slug).toBe('my-link')
      }
    })

    it('should accept slugs with numbers', () => {
      const result = Slug.create('my-link-123')

      expect(result.isSuccess()).toBe(true)
    })
  })

  describe('invalid slugs', () => {
    it('should reject slugs shorter than 3 characters', () => {
      const result = Slug.create('ab')

      expect(result.isFailure()).toBe(true)
    })

    it('should reject slugs longer than 50 characters', () => {
      const result = Slug.create('a'.repeat(51))

      expect(result.isFailure()).toBe(true)
    })

    it('should reject slugs with uppercase letters', () => {
      const result = Slug.create('My-Link')

      expect(result.isFailure()).toBe(true)
    })

    it('should reject slugs with spaces', () => {
      const result = Slug.create('my link')

      expect(result.isFailure()).toBe(true)
    })

    it('should reject slugs starting with a hyphen', () => {
      const result = Slug.create('-my-link')

      expect(result.isFailure()).toBe(true)
    })

    it('should reject slugs ending with a hyphen', () => {
      const result = Slug.create('my-link-')

      expect(result.isFailure()).toBe(true)
    })
  })

  describe('generate()', () => {
    it('should generate a slug from a long URL', () => {
      const slug = Slug.generate()

      expect(slug.isSuccess()).toBe(true)
      if (slug.isSuccess()) {
        expect(slug.value.slug).toMatch(/^[a-z0-9-]{3,50}$/)
      }
    })

    it('should generate unique slugs', () => {
      const slug1 = Slug.generate()
      const slug2 = Slug.generate()

      expect(slug1.isSuccess()).toBe(true)
      expect(slug2.isSuccess()).toBe(true)
      if (slug1.isSuccess() && slug2.isSuccess()) {
        expect(slug1.value.slug).not.toBe(slug2.value.slug)
      }
    })
  })
})