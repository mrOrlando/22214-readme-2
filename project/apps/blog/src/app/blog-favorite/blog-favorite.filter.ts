import * as Prisma from '@project/models';

export interface FavoriteFilter {
  id?: string;
  postId?: string;
  userId?: string;
}

export function favoriteFilterToPrismaFilter(
  filter?: FavoriteFilter
): Prisma.FavoriteWhereInput | undefined {
  if (!filter) {
    return undefined;
  }

  const prismaFilter: Prisma.FavoriteWhereInput = {};

  if (filter.postId) {
    prismaFilter.postId = filter.postId;
  }

  if (filter.userId) {
    prismaFilter.userId = filter.userId;
  }

  return prismaFilter;
}
