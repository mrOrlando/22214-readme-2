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

  public async findByPostId(postId: string): Promise<PublicationEntity | null> {
    const document = await this.model.findOne({ postId }).exec();
    return this.createEntityFromDocument(document);
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
    await this.model.updateMany({ _id: { $in: ids } }, { sentAt }).exec();
  }
}
