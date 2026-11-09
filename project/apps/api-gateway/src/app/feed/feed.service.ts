import { Injectable } from '@nestjs/common';
import { UserClient } from '../clients/user.client';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class FeedService {
  constructor(
    private readonly userClient: UserClient,
    private readonly postsService: PostsService
  ) {}

  // Posts of the authors the user is subscribed to and own posts. The
  // sorting, filters and pagination are the same as of the list of posts.
  public async getFeed(userId: string, accessToken: string, query: object) {
    const { authorIds } = await this.userClient.getSubscriptions(accessToken);

    return this.postsService.getPosts({
      ...query,
      userIds: [...new Set([userId, ...authorIds])],
    });
  }
}
