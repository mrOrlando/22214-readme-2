import * as Prisma from '@project/models';

export interface CommentFilter {
  id?: string;
  postId?: string;
  userId?: string;
}

export function commentFilterToPrismaFilter(
  filter?: CommentFilter
): Prisma.CommentWhereInput | undefined {
  if (!filter) {
    return undefined;
  }

  const prismaFilter: Prisma.CommentWhereInput = {};

  if (filter.postId) {
    prismaFilter.postId = filter.postId;
  }

  if (filter.userId) {
    prismaFilter.userId = filter.userId;
  }

  return prismaFilter;
}
