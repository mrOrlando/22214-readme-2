import { PostStatus, PostType } from '@project/types';

export interface TagResponse {
  id: string;
  title: string;
}

export interface PostResponse {
  id: string;
  type: PostType;
  status: PostStatus;
  title: string | null;
  videoUrl: string | null;
  announcement: string | null;
  text: string | null;
  quoteText: string | null;
  quoteAuthor: string | null;
  photo: string | null;
  linkUrl: string | null;
  linkDescription: string | null;
  userId: string;
  isRepost: boolean;
  originalPostId: string | null;
  originalUserId: string | null;
  createdAt: string;
  publishedAt: string;
  likesCount: number;
  commentsCount: number;
  tags: TagResponse[];
}

export interface CommentResponse {
  id: string;
  message: string;
  userId: string;
  postId: string;
  createdAt: string;
}

export interface LikeResponse {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
}

export interface PaginationResponse<T> {
  entities: T[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
}
