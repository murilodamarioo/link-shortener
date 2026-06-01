import { v4 as uuid } from 'uuid'

export class UniqueEntityId {
  private readonly _value: string

  constructor(value?: string) {
    this._value = value ?? uuid()
  }

  get value(): string {
    return this._value
  }

  public equals(id: UniqueEntityId): boolean {
    return this._value === id.value
  }

  public toString(): string {
    return this._value
  }
}