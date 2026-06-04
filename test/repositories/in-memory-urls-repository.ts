import { IUrlsRepository } from '@/modules/url/domain/repositories/urls.repository.interface'
import { Url } from '@/modules/url/domain/url.entity'

export class InMemoryUrlsRepository implements IUrlsRepository {

  public urls: Url[] = []

  async findById(id: string): Promise<Url | null> {
    const url = this.urls.find(url => url.id.value === id)

    return url ? url : null
  }

  async findBySlug(slug: string): Promise<Url | null> {
    const url = this.urls.find(url => url.slug === slug)

    return url ? url : null
  }

  async findAll(): Promise<Url[]> {
    const urls = this.urls

    return urls
  }

  async save(url: Url): Promise<void> {
    this.urls.push(url)
  }

  async update(url: Url): Promise<void> {
    const urlIndex = this.urls.findIndex(
      u => u.id.value === url.id.value
    )

    this.urls[urlIndex] = url
  }

  async delete(id: string): Promise<void> {
    const urls = this.urls.filter(
      (url) => url.id.value !== id
    )

    this.urls = urls
  }

}