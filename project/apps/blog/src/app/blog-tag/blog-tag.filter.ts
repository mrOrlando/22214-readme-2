import * as Prisma from '@project/models';

export interface TagFilter {
  id?: string;
  title?: string;
}

export function tagFilterToPrismaFilter(
  filter?: TagFilter
): Prisma.TagWhereInput | undefined {
  if (!filter) {
    return undefined;
  }

  let prismaFilter: Prisma.TagWhereInput = {};

  if (filter.title) {
    prismaFilter = {
      title: filter.title,
    };
  }

  return prismaFilter;
}
