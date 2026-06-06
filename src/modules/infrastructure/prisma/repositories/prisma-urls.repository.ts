import { Injectable } from '@nestjs/common'

import { IUrlsRepository } from '@/modules/url/domain/repositories/urls.repository.interface'

import { PrismaService } from '@/shared/database/prisma.service'
import { Url } from '@/modules/url/domain/url.entity'
import { PrismaUrlMapper } from '../mappera/prisma-url-mapper'

@Injectable()
export class PrismaUrlsRepository implements IUrlsRepository {

  constructor(private prisma: PrismaService) { }

  async findById(id: string): Promise<Url | null> {
    const url = await this.prisma.url.findUnique({
      where: { id }
    })

    return url ? PrismaUrlMapper.toDomain(url) : null
  }

  async findBySlug(slug: string): Promise<Url | null> {
    const url = await this.prisma.url.findUnique({
      where: { slug }
    })

    return url ? PrismaUrlMapper.toDomain(url) : null
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
  }

  async delete(id: string): Promise<void> {
    await this.prisma.url.delete({
      where: { id }
    })
  }

}