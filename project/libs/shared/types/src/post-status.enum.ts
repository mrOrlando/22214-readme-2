export const PostStatus = {
  Published: 'published',
  Draft: 'draft',
} as const;

export type PostStatus = (typeof PostStatus)[keyof typeof PostStatus];
