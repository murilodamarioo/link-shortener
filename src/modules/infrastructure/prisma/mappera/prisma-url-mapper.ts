import { Url } from '@/modules/url/domain/url.entity'
import { Slug } from '@/modules/url/domain/value-objects/slug'

import { Prisma, Url as PrismaUrl } from '@/generated/prisma/client'

export class PrismaUrlMapper {

  static toDomain(raw: PrismaUrl): Url {
    return Url.create({
      originalUrl: raw.originalUrl,
      customSlug: Slug.create(raw.slug),
      expiresAt: raw.expiresAt ?? undefined
    })
  }

  static toPrisma(url: Url): Prisma.UrlUncheckedCreateInput {
    return {
      id: url.id.toString(),
      originalUrl: url.originalUrl,
      slug: url.slug,
      isActive: url.isActive,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt
    }
  }

}