export const DEFAULT_POST_COUNT_LIMIT = 25;
export const DEFAULT_PAGE_COUNT = 1;

export const PostSortType = {
  Date: 'date',
  Likes: 'likes',
  Comments: 'comments',
} as const;

export type PostSortType = (typeof PostSortType)[keyof typeof PostSortType];
