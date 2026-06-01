import { UniqueEntityId } from '@/shared/core/unique-entity-id'

describe('UniqueEntityId', () => {
  it('should generate a unique id when no value is provided', () => {
    const id1 = new UniqueEntityId()
    const id2 = new UniqueEntityId()

    expect(id1.value).toBeDefined()
    expect(id2.value).toBeDefined()
    expect(id1.value).not.toBe(id2.value)
  })

  it('should use the provided value when given', () => {
    const knownId = '123e4567-e89b-12d3-a456-426614174000'
    const id = new UniqueEntityId(knownId)

    expect(id.value).toBe(knownId)
  })

  it('should correctly compare two equal ids', () => {
    const knownId = '123e4567-e89b-12d3-a456-426614174000'
    const id1 = new UniqueEntityId(knownId)
    const id2 = new UniqueEntityId(knownId)

    expect(id1.equals(id2)).toBe(true)
  })

  it('should correctly compare two different ids', () => {
    const id1 = new UniqueEntityId()
    const id2 = new UniqueEntityId()

    expect(id1.equals(id2)).toBe(false)
  })

  it('should return the string value via toString()', () => {
    const knownId = '123e4567-e89b-12d3-a456-426614174000'
    const id = new UniqueEntityId(knownId)

    expect(id.toString()).toBe(knownId)
  })
})