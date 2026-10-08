import { PostContent, PostType } from '@project/types';

export const PostTitleLength = { Min: 20, Max: 50 } as const;
export const PostAnnouncementLength = { Min: 50, Max: 255 } as const;
export const PostTextLength = { Min: 100, Max: 1024 } as const;
export const PostQuoteTextLength = { Min: 20, Max: 300 } as const;
export const PostQuoteAuthorLength = { Min: 3, Max: 50 } as const;
export const POST_LINK_DESCRIPTION_MAX_LENGTH = 300;
export const MAX_POST_TAGS_COUNT = 8;

export const YOUTUBE_URL_PATTERN =
  /^https?:\/\/(www\.|m\.)?(youtube\.com\/(watch\?(.*&)?v=|embed\/|shorts\/)|youtu\.be\/)[\w-]{11}([?&#].*)?$/;

export const YOUTUBE_URL_PATTERN_ERROR =
  'videoUrl must be a valid link to a YouTube video';

export const DEFAULT_POST_COUNT_LIMIT = 25;
export const DEFAULT_PAGE_COUNT = 1;
export const MAX_SEARCH_POST_COUNT = 20;

export const PostSortType = {
  Date: 'date',
  Likes: 'likes',
  Comments: 'comments',
} as const;

export type PostSortType = (typeof PostSortType)[keyof typeof PostSortType];

export const POST_CONTENT_FIELDS: (keyof PostContent)[] = [
  'title',
  'videoUrl',
  'announcement',
  'text',
  'quoteText',
  'quoteAuthor',
  'photo',
  'linkUrl',
  'linkDescription',
];

// Fields that belong to each post type; other content fields are not stored
export const POST_TYPE_FIELDS: Record<PostType, (keyof PostContent)[]> = {
  [PostType.Video]: ['title', 'videoUrl'],
  [PostType.Text]: ['title', 'announcement', 'text'],
  [PostType.Quote]: ['quoteText', 'quoteAuthor'],
  [PostType.Photo]: ['photo'],
  [PostType.Link]: ['linkUrl', 'linkDescription'],
};

export const POST_NOT_FOUND_ERROR = 'Post not found';
export const POST_FORBIDDEN_ERROR =
  'Only the author can edit or delete the post';
export const POST_ALREADY_REPOSTED_ERROR =
  'Post is already reposted by this user';
