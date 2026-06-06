import { ValueObject } from '@/shared/core/value-object'

interface OriginalUrlProps {
  url: string
}


export class OriginalUrl extends ValueObject<OriginalUrlProps> {
  get url(): string {
    return this.props.url
  }

  static isValid(url: string): boolean {
    try {
      const parsed = new URL(url)
      return parsed.protocol === 'http:' || parsed.protocol === 'https:'
    } catch {
      return false
    }
  }

  public static create(url: string): OriginalUrl {
    return new OriginalUrl({ url })
  }
}