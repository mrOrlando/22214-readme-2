import { randomUUID } from 'node:crypto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  RabbitEvent,
  RefreshTokenPayload,
  Token,
  TokenPayload,
  User,
  UserRole,
} from '@project/types';
import { RabbitPublisher } from '@project/helpers';
import { UserRepository } from '../user/user.repository';
import { UserEntity } from '../user/user.entity';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { ChangePasswordDto, CreateUserDto, LoginUserDto } from './dto';
import {
  AUTH_USER_EXISTS_ERROR,
  AUTH_USER_NOT_FOUND,
  AUTH_USER_PASSWORD_WRONG,
} from './auth.constants';

const MILLISECONDS_IN_SECOND = 1000;

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly rabbitPublisher: RabbitPublisher
  ) {}

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

    const newUser = await this.userRepository.save(user);

    // The notification service keeps registered users as mail recipients
    await this.rabbitPublisher.publish(RabbitEvent.UserRegistered, {
      userId: `${newUser.id}`,
      email: newUser.email,
      name: newUser.name,
    });

    return newUser;
  }

  public async verifyUser(dto: LoginUserDto) {
    const { email, password } = dto;
    const existingUser = await this.userRepository.findByEmail(email);
    if (!existingUser) {
      throw new NotFoundException(AUTH_USER_NOT_FOUND);
    }

    if (!(await existingUser.comparePassword(password))) {
      throw new UnauthorizedException(AUTH_USER_PASSWORD_WRONG);
    }

    return existingUser;
  }

  public async getUser(id: string) {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException(AUTH_USER_NOT_FOUND);
    }

    return existingUser;
  }

  public async createUserToken(user: User): Promise<Token> {
    return this.createToken({
      sub: `${user.id}`,
      email: user.email,
      name: user.name,
    });
  }

  public async createToken(payload: TokenPayload): Promise<Token> {
    const refreshTokenPayload: RefreshTokenPayload = {
      ...payload,
      tokenId: randomUUID(),
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
      secret: this.configService.getOrThrow<string>('jwt.refreshTokenSecret'),
      expiresIn: this.configService.getOrThrow('jwt.refreshTokenExpiresIn'),
    });

    const { exp } = this.jwtService.decode<{ exp: number }>(refreshToken);
    await this.refreshTokenService.createRefreshSession(
      refreshTokenPayload,
      new Date(exp * MILLISECONDS_IN_SECOND)
    );

    return { accessToken, refreshToken };
  }

  public async changePassword(userId: string, dto: ChangePasswordDto) {
    const existingUser = await this.getUser(userId);

    if (!(await existingUser.comparePassword(dto.currentPassword))) {
      throw new UnauthorizedException(AUTH_USER_PASSWORD_WRONG);
    }

    await existingUser.setPassword(dto.newPassword);
    await this.userRepository.update(userId, existingUser);

    // Tokens issued before the password change must not be refreshed
    await this.refreshTokenService.deleteUserRefreshSessions(userId);

    return existingUser;
  }
}
