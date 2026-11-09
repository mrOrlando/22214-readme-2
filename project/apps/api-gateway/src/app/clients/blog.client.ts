import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServiceClient } from './service-client';
import {
  CommentResponse,
  LikeResponse,
  PaginationResponse,
  PostResponse,
  TagResponse,
} from './types';

// The blog service trusts the "userId" it gets: the gateway always fills it
// from the access token and never from the data of the client
@Injectable()
export class BlogClient extends ServiceClient {
  constructor(http: HttpService, config: ConfigService) {
    super(http, config.getOrThrow<string>('gateway.blogServiceUrl'), 'blog');
  }

  public getPosts(query: object): Promise<PaginationResponse<PostResponse>> {
    return this.request('GET', '/posts', { query });
  }

  public getPost(id: string): Promise<PostResponse> {
    return this.request('GET', `/posts/${id}`);
  }

  public getDrafts(userId: string): Promise<PostResponse[]> {
    return this.request('GET', '/posts/drafts', { query: { userId } });
  }

  public searchPosts(title: string): Promise<PostResponse[]> {
    return this.request('GET', '/posts/search', { query: { title } });
  }

  public createPost(body: object): Promise<PostResponse> {
    return this.request('POST', '/posts', { body });
  }

  public updatePost(id: string, body: object): Promise<PostResponse> {
    return this.request('PATCH', `/posts/${id}`, { body });
  }

  public async deletePost(id: string, userId: string): Promise<void> {
    await this.request('DELETE', `/posts/${id}`, { query: { userId } });
  }

  public repostPost(id: string, userId: string): Promise<PostResponse> {
    return this.request('POST', `/posts/${id}/repost`, { body: { userId } });
  }

  public getComments(
    postId: string,
    query: object
  ): Promise<PaginationResponse<CommentResponse>> {
    return this.request('GET', `/posts/${postId}/comments`, { query });
  }

  public createComment(postId: string, body: object): Promise<CommentResponse> {
    return this.request('POST', `/posts/${postId}/comments`, { body });
  }

  public async deleteComment(id: string, userId: string): Promise<void> {
    await this.request('DELETE', `/comments/${id}`, { query: { userId } });
  }

  public likePost(postId: string, userId: string): Promise<LikeResponse> {
    return this.request('POST', `/posts/${postId}/likes`, { body: { userId } });
  }

  public async unlikePost(postId: string, userId: string): Promise<void> {
    await this.request('DELETE', `/posts/${postId}/likes`, {
      query: { userId },
    });
  }

  public getTags(): Promise<TagResponse[]> {
    return this.request('GET', '/tags');
  }
}
