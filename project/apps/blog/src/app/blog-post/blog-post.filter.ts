import * as Prisma from '@project/models';

export interface PostFilter {
  id?: string;
  title?: string;
  userId?: string;
  originalPostId?: string;
}

export function postFilterToPrismaFilter(
  filter?: PostFilter
): Prisma.PostWhereInput | undefined {
  if (!filter) {
    return undefined;
  }

  const prismaFilter: Prisma.PostWhereInput = {};

  if (filter.title) {
    prismaFilter.title = filter.title;
  }

  if (filter.userId) {
    prismaFilter.userId = filter.userId;
  }

  if (filter.originalPostId) {
    prismaFilter.originalPostId = filter.originalPostId;
  }

  return prismaFilter;
}
