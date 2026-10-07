import { Tag } from './tag.interface';
import { Comment } from './comment.interface';
import { PostType } from './post-type.enum';
import { PostStatus } from './post-status.enum';

export interface PostContent {
  title?: string | null;
  videoUrl?: string | null;
  announcement?: string | null;
  text?: string | null;
  quoteText?: string | null;
  quoteAuthor?: string | null;
  photo?: string | null;
  linkUrl?: string | null;
  linkDescription?: string | null;
}

export interface Post extends PostContent {
  id?: string;
  type: PostType;
  status?: PostStatus;
  publishedAt?: Date;
  isRepost?: boolean;
  originalPostId?: string | null;
  originalUserId?: string | null;
  tags: Tag[];
  createdAt?: Date;
  updatedAt?: Date;
  userId: string;
  comments: Comment[];
  likesCount?: number;
  commentsCount?: number;
}
