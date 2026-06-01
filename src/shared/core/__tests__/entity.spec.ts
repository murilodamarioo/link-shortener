import { Entity } from '@/shared/core/entity'
import { UniqueEntityId } from '@/shared/core/unique-entity-id'

interface FakeProps {
  name: string
  value: number
}

class FakeEntity extends Entity<FakeProps> {
  get name(): string {
    return this.props.name
  }

  get value(): number {
    return this.props.value
  }

  public changeName(name: string): void {
    this.props.name = name
  }

  public static create(props: FakeProps, id?: UniqueEntityId): FakeEntity {
    return new FakeEntity(props, id)
  }
}

describe('Entity', () => {
  describe('id generation', () => {
    it('should auto-generate an id when none is provided', () => {
      const entity = FakeEntity.create({ name: 'test', value: 1 })

      expect(entity.id).toBeDefined()
      expect(entity.id).toBeInstanceOf(UniqueEntityId)
      expect(entity.id.value).toBeTruthy()
    })

    it('should use the provided id when given', () => {
      const knownId = new UniqueEntityId('123e4567-e89b-12d3-a456-426614174000')
      const entity = FakeEntity.create({ name: 'test', value: 1 }, knownId)

      expect(entity.id.value).toBe('123e4567-e89b-12d3-a456-426614174000')
    })
  })

  describe('equals()', () => {
    it('should return true when comparing the same instance', () => {
      const entity = FakeEntity.create({ name: 'test', value: 1 })

      expect(entity.equals(entity)).toBe(true)
    })

    it('should return true when two entities share the same id', () => {
      const knownId = new UniqueEntityId('123e4567-e89b-12d3-a456-426614174000')
      const entity1 = FakeEntity.create({ name: 'foo', value: 1 }, knownId)
      const entity2 = FakeEntity.create({ name: 'bar', value: 2 }, knownId)

      expect(entity1.equals(entity2)).toBe(true)
    })

    it('should return false when two entities have different ids', () => {
      const entity1 = FakeEntity.create({ name: 'foo', value: 1 })
      const entity2 = FakeEntity.create({ name: 'foo', value: 1 })

      expect(entity1.equals(entity2)).toBe(false)
    })
  })

  describe('props access', () => {
    it('should expose props through getters', () => {
      const entity = FakeEntity.create({ name: 'test', value: 42 })

      expect(entity.name).toBe('test')
      expect(entity.value).toBe(42)
    })

    it('should reflect internal mutations through getters', () => {
      const entity = FakeEntity.create({ name: 'original', value: 1 })
      entity.changeName('updated')

      expect(entity.name).toBe('updated')
    })
  })

  describe('rehydration', () => {
    it('should rehydrate correctly from persistence with existing id', () => {
      const persistedId = new UniqueEntityId('123e4567-e89b-12d3-a456-426614174000')

      const entity = FakeEntity.create({ name: 'persisted', value: 99 }, persistedId)

      expect(entity.id.equals(persistedId)).toBe(true)
      expect(entity.name).toBe('persisted')
    })
  })
})