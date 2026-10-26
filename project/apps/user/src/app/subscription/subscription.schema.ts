import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'subscriptions',
  timestamps: true,
})
export class SubscriptionModel extends Document {
  @Prop({ required: true, type: String, index: true })
  public subscriberId!: string;

  @Prop({ required: true, type: String, index: true })
  public authorId!: string;
}

export const SubscriptionSchema =
  SchemaFactory.createForClass(SubscriptionModel);

// A user can subscribe to an author only once
SubscriptionSchema.index({ subscriberId: 1, authorId: 1 }, { unique: true });
