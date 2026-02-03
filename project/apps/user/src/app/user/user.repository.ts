import { BaseMemoryRepository } from '@project/helpers';
import { UserEntity } from './user.entity';
import { Injectable } from '@nestjs/common';
import { AuthUser } from '@project/types';

@Injectable()
export class UserRepository extends BaseMemoryRepository<UserEntity, AuthUser> {
  public async findByEmail(email: string): Promise<UserEntity | null> {
    const entities = Array.from(this.entities.values());
    const user = entities.find((entity) => entity.email === email) || null;
    return Promise.resolve(user);
  }
}
