import {
  IsIn,
  IsISO8601,
  IsMongoId,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';
import { PostPublishedPayload, PostType } from '@project/types';

export class AddPublicationDto implements PostPublishedPayload {
  @IsUUID()
  public postId!: string;

  @IsMongoId()
  public userId!: string;

  @IsIn(Object.values(PostType))
  public type!: PostType;

  @IsString()
  @IsNotEmpty()
  public title!: string;

  @IsISO8601()
  public publishedAt!: string;
}
