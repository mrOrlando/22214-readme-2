import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SubscriptionRepository } from '../subscription/subscription.repository';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import {
  SUBSCRIPTION_EXISTS_ERROR,
  SUBSCRIPTION_NOT_FOUND_ERROR,
  SUBSCRIPTION_YOURSELF_ERROR,
  USER_NOT_FOUND_ERROR,
} from './user.constants';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly subscriptionRepository: SubscriptionRepository
  ) {}

  public async getUsersByIds(ids: string[]): Promise<UserEntity[]> {
    return this.userRepository.findByIds(ids);
  }

  public async getUserDetails(
    id: string
  ): Promise<{ user: UserEntity; subscribersCount: number }> {
    const user = await this.getExistingUser(id);
    const subscribersCount = await this.subscriptionRepository.countSubscribers(
      id
    );

    return { user, subscribersCount };
  }

  public async subscribe(
    subscriberId: string,
    authorId: string
  ): Promise<void> {
    if (subscriberId === authorId) {
      throw new BadRequestException(SUBSCRIPTION_YOURSELF_ERROR);
    }

    await this.getExistingUser(authorId);

    const isCreated = await this.subscriptionRepository.create(
      subscriberId,
      authorId
    );
    if (!isCreated) {
      throw new ConflictException(SUBSCRIPTION_EXISTS_ERROR);
    }
  }

  public async unsubscribe(
    subscriberId: string,
    authorId: string
  ): Promise<void> {
    const isDeleted = await this.subscriptionRepository.delete(
      subscriberId,
      authorId
    );
    if (!isDeleted) {
      throw new NotFoundException(SUBSCRIPTION_NOT_FOUND_ERROR);
    }
  }

  public async getSubscriptions(subscriberId: string): Promise<string[]> {
    return this.subscriptionRepository.findAuthorIds(subscriberId);
  }

  private async getExistingUser(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND_ERROR);
    }

    return user;
  }
}
