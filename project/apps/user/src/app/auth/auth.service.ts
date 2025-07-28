import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { UserEntity } from '../user/user.entity';
import { CreateUserDto } from './dto';
import { AUTH_USER_EXISTS_ERROR } from './auth.constants';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  public async register(dto: CreateUserDto) {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException(AUTH_USER_EXISTS_ERROR);
    }

    const user = await new UserEntity({
      email: dto.email,
      name: dto.name,
      passwordHash: '',
    }).setPassword(dto.password);

    return this.userRepository.save(user);
  }
}
