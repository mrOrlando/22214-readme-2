import { Injectable, NotFoundException } from '@nestjs/common';
import { PostStatus } from '@project/types';
import { BlogClient } from '../clients/blog.client';
import { PostResponse } from '../clients/types';
import { AuthorsService } from '../users/authors.service';

const POST_NOT_FOUND_ERROR = 'Post not found';

// The gateway adds authors to the posts of the blog service. Rules of posts
// are checked by the blog service.
@Injectable()
export class PostsService {
  constructor(
    private readonly blogClient: BlogClient,
    private readonly authorsService: AuthorsService
  ) {}

  public async getPosts(query: object) {
    const page = await this.blogClient.getPosts(query);
    return { ...page, entities: await this.withAuthors(page.entities) };
  }

  public async searchPosts(title: string) {
    return this.withAuthors(await this.blogClient.searchPosts(title));
  }

  public async getDrafts(userId: string) {
    return this.withAuthors(await this.blogClient.getDrafts(userId));
  }

  // A draft is seen only by its author
  public async getPost(id: string, viewerId?: string) {
    const post = await this.blogClient.getPost(id);
    if (post.status === PostStatus.Draft && post.userId !== viewerId) {
      throw new NotFoundException(POST_NOT_FOUND_ERROR);
    }

    return (await this.withAuthors([post]))[0];
  }

  public async createPost(userId: string, dto: object) {
    const post = await this.blogClient.createPost({ ...dto, userId });
    return (await this.withAuthors([post]))[0];
  }

  public async updatePost(id: string, userId: string, dto: object) {
    const post = await this.blogClient.updatePost(id, { ...dto, userId });
    return (await this.withAuthors([post]))[0];
  }

  public async deletePost(id: string, userId: string): Promise<void> {
    await this.blogClient.deletePost(id, userId);
  }

  public async repostPost(id: string, userId: string) {
    const post = await this.blogClient.repostPost(id, userId);
    return (await this.withAuthors([post]))[0];
  }

  private async withAuthors(posts: PostResponse[]) {
    const authors = await this.authorsService.getAuthors(
      posts.flatMap(({ userId, originalUserId }) => [
        userId,
        originalUserId ?? '',
      ])
    );

    return posts.map((post) => ({
      ...post,
      author: authors.get(post.userId) ?? null,
      originalAuthor: post.originalUserId
        ? authors.get(post.originalUserId) ?? null
        : null,
    }));
  }
}
