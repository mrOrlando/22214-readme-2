import { Entity, EntityIdType } from '@project/helpers';
import { PostType } from '@project/types';

export interface Publication {
  id?: EntityIdType;
  postId: string;
  userId: string;
  type: PostType;
  title: string;
  publishedAt: Date;
  sentAt?: Date | null;
}

export class PublicationEntity
  implements Publication, Entity<EntityIdType, Publication>
{
  public id?: EntityIdType;
  public postId!: string;
  public userId!: string;
  public type!: PostType;
  public title!: string;
  public publishedAt!: Date;
  public sentAt?: Date | null;

  constructor(publication: Publication) {
    this.populate(publication);
  }

  public populate(publication: Publication): void {
    this.id = publication.id ?? undefined;
    this.postId = publication.postId;
    this.userId = publication.userId;
    this.type = publication.type;
    this.title = publication.title;
    this.publishedAt = publication.publishedAt;
    this.sentAt = publication.sentAt ?? null;
  }

  public toPOJO(): Publication {
    return {
      id: this.id,
      postId: this.postId,
      userId: this.userId,
      type: this.type,
      title: this.title,
      publishedAt: this.publishedAt,
      sentAt: this.sentAt ?? null,
    };
  }

  public static fromObject(data: Publication): PublicationEntity {
    return new PublicationEntity(data);
  }
}
