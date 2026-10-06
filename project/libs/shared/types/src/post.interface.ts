import { Tag } from './tag.interface';
import { Comment } from './comment.interface';

export interface Post {
  id?: string;
  title: string;
  tags: Tag[];
  description: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  userId: string;
  comments: Comment[];
}
