import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseMongoRepository } from '@project/helpers';
import { PublicationEntity } from './publication.entity';
import { PublicationModel } from './publication.schema';

@Injectable()
export class PublicationRepository extends BaseMongoRepository<
  PublicationEntity,
  PublicationModel
> {
  constructor(
    @InjectModel(PublicationModel.name)
    publicationModel: Model<PublicationModel>
  ) {
    super(publicationModel, PublicationEntity.fromObject);
  }

  // Atomic: parallel events for the same post create one publication
  public async saveIfNew(
    entity: PublicationEntity
  ): Promise<PublicationEntity> {
    const { postId, userId, type, title, publishedAt } = entity;
    const document = await this.model
      .findOneAndUpdate(
        { postId },
        { $setOnInsert: { postId, userId, type, title, publishedAt } },
        { upsert: true, new: true }
      )
      .exec();

    return this.createEntityFromDocument(document) ?? entity;
  }

  public async findNotSent(): Promise<PublicationEntity[]> {
    const documents = await this.model
      .find({ sentAt: null })
      .sort({ publishedAt: 1 })
      .exec();

    return documents
      .map((document) => this.createEntityFromDocument(document))
      .filter(
        (publication): publication is PublicationEntity => publication !== null
      );
  }

  public async markAsSent(ids: string[], sentAt: Date): Promise<void> {
    await this.model
      .updateMany({ _id: { $in: ids } }, { sentAt, deliveredTo: [] })
      .exec();
  }

  public async addRecipients(
    ids: string[],
    subscriberIds: string[]
  ): Promise<void> {
    await this.model
      .updateMany(
        { _id: { $in: ids } },
        { $addToSet: { deliveredTo: { $each: subscriberIds } } }
      )
      .exec();
  }
}
