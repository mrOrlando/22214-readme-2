import { BaseMongoRepository } from '@project/helpers';
import { UserEntity } from './user.entity';
import { Injectable } from '@nestjs/common';
import { AuthUser } from '@project/types';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository extends BaseMongoRepository<
  UserEntity,
  UserDocument
> {
  constructor(@InjectModel(User.name) userModel: Model<UserDocument>) {
    super(userModel, (doc) =>
      UserEntity.fromObject(doc as unknown as AuthUser)
    );
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    const document = await this.model.findOne({ email }).exec();
    return this.createEntityFromDocument(document);
  }
}
