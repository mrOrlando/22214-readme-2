import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PostType } from '@project/types';

@Schema({
  collection: 'publications',
  timestamps: true,
})
export class PublicationModel extends Document {
  @Prop({ required: true, unique: true, type: String })
  public postId!: string;

  @Prop({ required: true, type: String })
  public userId!: string;

  @Prop({ required: true, type: String, enum: Object.values(PostType) })
  public type!: PostType;

  @Prop({ required: true, type: String })
  public title!: string;

  @Prop({ required: true, type: Date })
  public publishedAt!: Date;

  // null until the publication is included in a sent digest
  @Prop({ type: Date, default: null, index: true })
  public sentAt!: Date | null;

  // Ids of the subscribers who received the publication while it is not
  // sent to everyone; they do not get it again when the mailing is repeated
  @Prop({ type: [String], default: [] })
  public deliveredTo!: string[];
}

export const PublicationSchema = SchemaFactory.createForClass(PublicationModel);
