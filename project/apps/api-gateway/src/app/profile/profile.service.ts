import { Injectable } from '@nestjs/common';
import { BlogClient } from '../clients/blog.client';
import { UserClient } from '../clients/user.client';

// The user service knows registration date and subscribers, the blog service
// knows posts: the gateway joins them in one profile
@Injectable()
export class ProfileService {
  constructor(
    private readonly userClient: UserClient,
    private readonly blogClient: BlogClient
  ) {}

  public async getProfile(id: string, viewerAccessToken?: string) {
    const [details, posts, isSubscribed] = await Promise.all([
      this.userClient.getUserDetails(id),
      // Only the total is needed, so the page has one post
      this.blogClient.getPosts({ userId: id, limit: 1 }),
      this.isSubscribed(id, viewerAccessToken),
    ]);

    return { ...details, postsCount: posts.totalItems, isSubscribed };
  }

  public async getSubscriptions(accessToken: string) {
    const { authorIds } = await this.userClient.getSubscriptions(accessToken);
    if (authorIds.length === 0) {
      return [];
    }

    const authors = new Map(
      (await this.userClient.getUsersByIds(authorIds)).map((author) => [
        author.id,
        author,
      ])
    );

    // The newest subscription goes first; deleted users are skipped
    return authorIds.flatMap((id) => authors.get(id) ?? []);
  }

  public async subscribe(accessToken: string, authorId: string): Promise<void> {
    await this.userClient.subscribe(accessToken, authorId);
  }

  public async unsubscribe(
    accessToken: string,
    authorId: string
  ): Promise<void> {
    await this.userClient.unsubscribe(accessToken, authorId);
  }

  private async isSubscribed(
    authorId: string,
    accessToken?: string
  ): Promise<boolean> {
    if (!accessToken) {
      return false;
    }

    const { authorIds } = await this.userClient.getSubscriptions(accessToken);
    return authorIds.includes(authorId);
  }
}
