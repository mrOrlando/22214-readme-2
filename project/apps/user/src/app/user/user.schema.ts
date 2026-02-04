import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AuthUser, UserRole } from '@project/types';

@Schema({
  timestamps: true,
  collection: 'users',
})
export class UserModel extends Document implements AuthUser {
  @Prop()
  name!: string;

  @Prop({
    required: true,
    unique: true,
  })
  email!: string;

  @Prop()
  passwordHash!: string;

  @Prop({
    required: true,
    type: String,
    enum: UserRole,
    default: UserRole.User,
  })
  public role!: UserRole;
}

export const UserModelSchema = SchemaFactory.createForClass(UserModel);
