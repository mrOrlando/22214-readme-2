import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServiceClient } from './service-client';
import {
  LoggedUserResponse,
  PublicUserResponse,
  SubscriptionsResponse,
  TokenPairResponse,
  UserDetailsResponse,
  UserResponse,
} from './types';

@Injectable()
export class UserClient extends ServiceClient {
  constructor(http: HttpService, config: ConfigService) {
    super(http, config.getOrThrow<string>('gateway.userServiceUrl'), 'user');
  }

  public register(body: object): Promise<UserResponse> {
    return this.request('POST', '/auth/register', { body });
  }

  public login(body: object): Promise<LoggedUserResponse> {
    return this.request('POST', '/auth/login', { body });
  }

  // The service takes the refresh token the same way as an access token
  public refreshTokens(refreshToken: string): Promise<TokenPairResponse> {
    return this.request('POST', '/auth/refresh', {
      accessToken: refreshToken,
    });
  }

  public changePassword(
    accessToken: string,
    body: object
  ): Promise<UserResponse> {
    return this.request('PATCH', '/auth/password', { accessToken, body });
  }

  public getUsersByIds(ids: string[]): Promise<PublicUserResponse[]> {
    return this.request('GET', '/users', { query: { ids } });
  }

  public getUserDetails(id: string): Promise<UserDetailsResponse> {
    return this.request('GET', `/users/${id}`);
  }

  public getSubscriptions(accessToken: string): Promise<SubscriptionsResponse> {
    return this.request('GET', '/users/me/subscriptions', { accessToken });
  }

  public async subscribe(accessToken: string, authorId: string): Promise<void> {
    await this.request('POST', `/users/${authorId}/subscription`, {
      accessToken,
    });
  }

  public async unsubscribe(
    accessToken: string,
    authorId: string
  ): Promise<void> {
    await this.request('DELETE', `/users/${authorId}/subscription`, {
      accessToken,
    });
  }
}
