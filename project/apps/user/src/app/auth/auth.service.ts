import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { UserEntity } from '../user/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import {
  AUTH_USER_EXISTS_ERROR,
  AUTH_USER_NOT_FOUND,
  AUTH_USER_PASSWORD_WRONG,
} from './auth.constants';
import { UserRole } from '@project/types';

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
      role: UserRole.User,
      passwordHash: '',
    }).setPassword(dto.password);

    return this.userRepository.save(user);
  }

  public async verifyUser(dto: LoginUserDto) {
    const { email, password } = dto;

    const existingUser = await this.userRepository.findByEmail(email);

    if (!existingUser) {
      throw new NotFoundException(AUTH_USER_NOT_FOUND);
    }

    const userEntity = await new UserEntity(existingUser);
    if (!(await userEntity.comparePassword(password))) {
      throw new UnauthorizedException(AUTH_USER_PASSWORD_WRONG);
    }

    return userEntity.toPOJO();
  }

  public async getUser(id: string) {
    const existingUser = await this.userRepository.findById(id);

    if (!existingUser) {
      throw new NotFoundException(AUTH_USER_NOT_FOUND);
    }

    return existingUser;
  }
}
