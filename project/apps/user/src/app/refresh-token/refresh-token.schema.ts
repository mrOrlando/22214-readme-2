import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { JwtToken } from '@project/types';

@Schema({
  collection: 'refresh-sessions',
  timestamps: true,
})
export class RefreshTokenModel extends Document implements JwtToken {
  @Prop({ required: true, type: String, unique: true })
  public tokenId!: string;

  @Prop({ required: true, type: String })
  public userId!: string;

  @Prop({ type: Date })
  public createdAt!: Date;

  // MongoDB removes the session automatically when it expires
  @Prop({ required: true, type: Date, expires: 0 })
  public expiresIn!: Date;
}

export const RefreshTokenSchema =
  SchemaFactory.createForClass(RefreshTokenModel);
