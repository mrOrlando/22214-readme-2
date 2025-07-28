import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}
}
