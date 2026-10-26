import { BaseMongoRepository } from '@project/helpers';
import { UserEntity } from './user.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository extends BaseMongoRepository<UserEntity, UserModel> {
  constructor(@InjectModel(UserModel.name) userModel: Model<UserModel>) {
    super(userModel, UserEntity.fromObject);
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    const document = await this.model.findOne({ email }).exec();
    return this.createEntityFromDocument(document);
  }

  public async findByIds(ids: string[]): Promise<UserEntity[]> {
    const documents = await this.model.find({ _id: { $in: ids } }).exec();

    return documents
      .map((document) => this.createEntityFromDocument(document))
      .filter((user): user is UserEntity => user !== null);
  }
}
