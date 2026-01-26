import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  collection: 'users',
})
export class User {
  @Prop()
  name!: string;

  @Prop()
  age!: number;

  @Prop()
  birthDate!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
