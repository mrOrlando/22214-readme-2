import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'email-subscribers',
  timestamps: true,
})
export class EmailSubscriberModel extends Document {
  @Prop({ required: true, unique: true, type: String })
  public email!: string;

  @Prop({ required: true, type: String })
  public name!: string;

  @Prop({ required: true, type: String })
  public userId!: string;
}

export const EmailSubscriberSchema =
  SchemaFactory.createForClass(EmailSubscriberModel);
