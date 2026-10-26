import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseMongoRepository } from '@project/helpers';
import { EmailSubscriberEntity } from './email-subscriber.entity';
import { EmailSubscriberModel } from './email-subscriber.schema';

@Injectable()
export class EmailSubscriberRepository extends BaseMongoRepository<
  EmailSubscriberEntity,
  EmailSubscriberModel
> {
  constructor(
    @InjectModel(EmailSubscriberModel.name)
    emailSubscriberModel: Model<EmailSubscriberModel>
  ) {
    super(emailSubscriberModel, EmailSubscriberEntity.fromObject);
  }

  // Atomic: parallel events for the same email create one subscriber
  public async saveIfNew(
    entity: EmailSubscriberEntity
  ): Promise<EmailSubscriberEntity> {
    const { email, name, userId } = entity;
    const document = await this.model
      .findOneAndUpdate(
        { email },
        { $setOnInsert: { email, name, userId } },
        { upsert: true, new: true }
      )
      .exec();

    return this.createEntityFromDocument(document) ?? entity;
  }

  public async findAll(): Promise<EmailSubscriberEntity[]> {
    const documents = await this.model.find().exec();

    return documents
      .map((document) => this.createEntityFromDocument(document))
      .filter(
        (subscriber): subscriber is EmailSubscriberEntity => subscriber !== null
      );
  }
}
