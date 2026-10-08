import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseMongoRepository } from '@project/helpers';
import { RefreshTokenEntity } from './refresh-token.entity';
import { RefreshTokenModel } from './refresh-token.schema';

@Injectable()
export class RefreshTokenRepository extends BaseMongoRepository<
  RefreshTokenEntity,
  RefreshTokenModel
> {
  constructor(
    @InjectModel(RefreshTokenModel.name)
    refreshTokenModel: Model<RefreshTokenModel>
  ) {
    super(refreshTokenModel, RefreshTokenEntity.fromObject);
  }

  public async findByTokenId(
    tokenId: string
  ): Promise<RefreshTokenEntity | null> {
    const document = await this.model.findOne({ tokenId }).exec();
    return this.createEntityFromDocument(document);
  }

  public async deleteByTokenId(tokenId: string): Promise<void> {
    await this.model.deleteOne({ tokenId }).exec();
  }

  public async deleteByUserId(userId: string): Promise<void> {
    await this.model.deleteMany({ userId }).exec();
  }
}
