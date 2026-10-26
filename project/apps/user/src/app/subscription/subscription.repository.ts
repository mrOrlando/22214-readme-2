import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubscriptionModel } from './subscription.schema';

const DUPLICATE_KEY_ERROR_CODE = 11000;

@Injectable()
export class SubscriptionRepository {
  constructor(
    @InjectModel(SubscriptionModel.name)
    private readonly model: Model<SubscriptionModel>
  ) {}

  // Returns false when the subscription already exists
  public async create(
    subscriberId: string,
    authorId: string
  ): Promise<boolean> {
    try {
      await this.model.create({ subscriberId, authorId });
      return true;
    } catch (error) {
      if ((error as { code?: number }).code === DUPLICATE_KEY_ERROR_CODE) {
        return false;
      }
      throw error;
    }
  }

  // Returns false when there was no such subscription
  public async delete(
    subscriberId: string,
    authorId: string
  ): Promise<boolean> {
    const { deletedCount } = await this.model
      .deleteOne({ subscriberId, authorId })
      .exec();

    return deletedCount > 0;
  }

  public async findAuthorIds(subscriberId: string): Promise<string[]> {
    const subscriptions = await this.model
      .find({ subscriberId })
      .sort({ createdAt: -1 })
      .exec();

    return subscriptions.map(({ authorId }) => authorId);
  }

  public async countSubscribers(authorId: string): Promise<number> {
    return this.model.countDocuments({ authorId }).exec();
  }
}
