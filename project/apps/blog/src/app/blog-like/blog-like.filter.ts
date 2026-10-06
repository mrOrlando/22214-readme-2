import * as Prisma from '@project/models';

export interface LikeFilter {
  id?: string;
  postId?: string;
  userId?: string;
}

export function likeFilterToPrismaFilter(
  filter?: LikeFilter
): Prisma.LikeWhereInput | undefined {
  if (!filter) {
    return undefined;
  }

  const prismaFilter: Prisma.LikeWhereInput = {};

  if (filter.postId) {
    prismaFilter.postId = filter.postId;
  }

  if (filter.userId) {
    prismaFilter.userId = filter.userId;
  }

  return prismaFilter;
}
