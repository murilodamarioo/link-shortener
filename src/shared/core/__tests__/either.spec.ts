import { failure, success, Either } from '@/shared/core/either'

class FakeError extends Error {
  constructor() {
    super('fake error')
  }
}

describe('Either', () => {
  describe('success()', () => {
    it('should create a Success instance', () => {
      const result = success<FakeError, string>('ok')

      expect(result.isSuccess()).toBe(true)
      expect(result.isFailure()).toBe(false)
    })

    it('should hold the success value', () => {
      const result = success<FakeError, string>('ok')

      expect(result.value).toBe('ok')
    })

    it('should narrow the type to Success via isSuccess()', () => {
      const result: Either<FakeError, string> = success('ok')

      if (result.isSuccess()) {
        expect(result.value.toUpperCase()).toBe('OK')
      }
    })
  })

  describe('failure()', () => {
    it('should create a Failure instance', () => {
      const result = failure<FakeError, string>(new FakeError())

      expect(result.isFailure()).toBe(true)
      expect(result.isSuccess()).toBe(false)
    })

    it('should hold the failure value', () => {
      const error = new FakeError()
      const result = failure<FakeError, string>(error)

      expect(result.value).toBe(error)
    })

    it('should narrow the type to Failure via isFailure()', () => {
      const result: Either<FakeError, string> = failure(new FakeError())

      if (result.isFailure()) {
        expect(result.value.message).toBe('fake error')
      }
    })
  })

  describe('type narrowing', () => {
    it('should not access success value without narrowing', () => {
      const result: Either<FakeError, string> = success('ok')

      if (result.isSuccess()) {
        expect(result.value).toBe('ok')
      } else {
        fail('Should not reach failure branch')
      }
    })
  })
})