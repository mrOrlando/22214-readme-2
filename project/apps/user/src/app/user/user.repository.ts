import { BaseMemoryRepository } from '@project/helpers';
import { UserEntity } from './user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends BaseMemoryRepository<UserEntity> {}
