import { Comment, PostType, Tag } from '@project/types';
import { Expose } from 'class-transformer';

export class PostRdo {
  @Expose()
  public id!: string;

  @Expose()
  public type!: PostType;

  @Expose()
  public title!: string | null;

  @Expose()
  public videoUrl!: string | null;

  @Expose()
  public announcement!: string | null;

  @Expose()
  public text!: string | null;

  @Expose()
  public quoteText!: string | null;

  @Expose()
  public quoteAuthor!: string | null;

  @Expose()
  public photo!: string | null;

  @Expose()
  public linkUrl!: string | null;

  @Expose()
  public linkDescription!: string | null;

  @Expose()
  public userId!: string;

  @Expose()
  public createdAt!: Date;

  @Expose()
  public tags!: Tag[];

  @Expose()
  public comments!: Comment[];
}
