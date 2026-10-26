import { Injectable } from '@nestjs/common';
import { BlogClient } from '../clients/blog.client';
import { CommentResponse } from '../clients/types';
import { AuthorsService } from '../users/authors.service';

@Injectable()
export class CommentsService {
  constructor(
    private readonly blogClient: BlogClient,
    private readonly authorsService: AuthorsService
  ) {}

  public async getComments(postId: string, query: object) {
    const page = await this.blogClient.getComments(postId, query);
    return { ...page, entities: await this.withAuthors(page.entities) };
  }

  public async createComment(postId: string, userId: string, message: string) {
    const comment = await this.blogClient.createComment(postId, {
      message,
      userId,
    });

    return (await this.withAuthors([comment]))[0];
  }

  public async deleteComment(id: string, userId: string): Promise<void> {
    await this.blogClient.deleteComment(id, userId);
  }

  private async withAuthors(comments: CommentResponse[]) {
    const authors = await this.authorsService.getAuthors(
      comments.map(({ userId }) => userId)
    );

    return comments.map((comment) => ({
      ...comment,
      author: authors.get(comment.userId) ?? null,
    }));
  }
}
