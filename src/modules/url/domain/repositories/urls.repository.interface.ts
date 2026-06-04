import { Url } from '../url.entity'

export abstract class IUrlsRepository {

  abstract findById(id: string): Promise<Url | null>

  abstract findBySlug(slug: string): Promise<Url | null>

  abstract findAll(): Promise<Url[]>

  abstract save(url: Url): Promise<void>

  abstract update(url: Url): Promise<void>

  abstract delete(id: string): Promise<void>

}

export const URLS_REPOSITORY = 'URLS_REPOSITORY'