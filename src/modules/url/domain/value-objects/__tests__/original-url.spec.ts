import { OriginalUrl } from '../original-url'

describe('OriginalUrl', () => {
  describe('valid URLs', () => {
    it('should create with a valid https URL', () => {
      const result = OriginalUrl.create('https://google.com')

      expect(result.isSuccess()).toBe(true)
    })

    it('should create with a valid http URL', () => {
      const result = OriginalUrl.create('http://example.com')

      expect(result.isSuccess()).toBe(true)
    })

    it('should store the URL value', () => {
      const result = OriginalUrl.create('https://google.com/path?q=1')

      expect(result.isSuccess()).toBe(true)
      if (result.isSuccess()) {
        expect(result.value.url).toBe('https://google.com/path?q=1')
      }
    })
  })

  describe('invalid URLs', () => {
    it('should reject an empty string', () => {
      const result = OriginalUrl.create('')

      expect(result.isFailure()).toBe(true)
    })

    it('should reject a URL without protocol', () => {
      const result = OriginalUrl.create('google.com')

      expect(result.isFailure()).toBe(true)
    })

    it('should reject a URL with ftp protocol', () => {
      const result = OriginalUrl.create('ftp://files.example.com')

      expect(result.isFailure()).toBe(true)
    })

    it('should reject plain text', () => {
      const result = OriginalUrl.create('not a url')

      expect(result.isFailure()).toBe(true)
    })
  })
})