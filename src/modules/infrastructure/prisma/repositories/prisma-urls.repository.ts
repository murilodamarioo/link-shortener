import { Injectable } from '@nestjs/common'

import { IUrlsRepository } from '@/modules/url/domain/repositories/urls.repository.interface'
import { Url } from '@/modules/url/domain/url.entity'

import { PrismaUrlMapper } from '../mappera/prisma-url-mapper'

import { PrismaService } from '@/shared/database/prisma.service'
import { CacheRepository } from '@/shared/cache/cache.repository'

@Injectable()
export class PrismaUrlsRepository implements IUrlsRepository {

  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository
  ) { }

  async findById(id: string): Promise<Url | null> {
    const url = await this.prisma.url.findUnique({
      where: { id }
    })

    return url ? PrismaUrlMapper.toDomain(url) : null
  }

  async findBySlug(slug: string): Promise<Url | null> {
    const cacheKey = `url:${slug}`
    const cacheHit = await this.cache.get(cacheKey)

    if (cacheHit) {
      const cacheData = JSON.parse(cacheHit)

      return PrismaUrlMapper.toDomain(cacheData)
    }

    const url = await this.prisma.url.findUnique({
      where: { slug }
    })

    if (!url) return null

    await this.cache.set(cacheKey, JSON.stringify(url))

    return PrismaUrlMapper.toDomain(url)
  }

  async findAll(): Promise<Url[]> {
    const urls = await this.prisma.url.findMany()

    return urls.map((url) => PrismaUrlMapper.toDomain(url))
  }

  async save(url: Url): Promise<void> {
    const data = PrismaUrlMapper.toPrisma(url)

    await this.prisma.url.create({ data })
  }

  async update(url: Url): Promise<void> {
    const data = PrismaUrlMapper.toPrisma(url)

    await this.prisma.url.update({
      where: { id: data.id },
      data
    })

    const cacheKey = `url:${url.slug}`
    await this.cache.delete(cacheKey)
  }

  async delete(id: string): Promise<void> {
    const url = await this.prisma.url.findUnique({
      where: { id }
    })

    await this.prisma.url.delete({
      where: { id }
    })

    if (url) {
      const cacheKey = `url:${url.slug}`
      await this.cache.delete(cacheKey)
    }
  }

}