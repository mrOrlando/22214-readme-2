import { Injectable } from '@nestjs/common';
import { UserClient } from '../clients/user.client';
import { PublicUserResponse } from '../clients/types';

export type Author = PublicUserResponse;

// The blog service knows only IDs of the authors: their names and avatars
// are taken from the user service in one request for a whole list
@Injectable()
export class AuthorsService {
  constructor(private readonly userClient: UserClient) {}

  public async getAuthors(ids: string[]): Promise<Map<string, Author>> {
    const uniqueIds = [...new Set(ids.filter(Boolean))];
    if (uniqueIds.length === 0) {
      return new Map();
    }

    const authors = await this.userClient.getUsersByIds(uniqueIds);
    return new Map(authors.map((author) => [author.id, author]));
  }
}
