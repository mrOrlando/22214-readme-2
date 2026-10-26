import { PostType } from './post-type.enum';

export interface UserRegisteredPayload {
  userId: string;
  email: string;
  name: string;
}

export interface PostPublishedPayload {
  postId: string;
  userId: string;
  type: PostType;
  title: string;
  publishedAt: string;
}
