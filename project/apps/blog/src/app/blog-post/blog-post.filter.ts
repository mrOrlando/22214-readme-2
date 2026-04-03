import * as Prisma from '@project/models';

export interface PostFilter {
  id?: string;
  title?: string;
}

export function postFilterToPrismaFilter(
  filter?: PostFilter
): Prisma.PostWhereInput | undefined {
  if (!filter) {
    return undefined;
  }

  let prismaFilter: Prisma.PostWhereInput = {};

  if (filter.title) {
    prismaFilter = {
      title: filter.title,
    };
  }

  return prismaFilter;
}
