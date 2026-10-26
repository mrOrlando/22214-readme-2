import { Entity, EntityIdType } from '@project/helpers';

export interface EmailSubscriber {
  id?: EntityIdType;
  email: string;
  name: string;
  userId: string;
}

export class EmailSubscriberEntity
  implements EmailSubscriber, Entity<EntityIdType, EmailSubscriber>
{
  public id?: EntityIdType;
  public email!: string;
  public name!: string;
  public userId!: string;

  constructor(subscriber: EmailSubscriber) {
    this.populate(subscriber);
  }

  public populate(subscriber: EmailSubscriber): void {
    this.id = subscriber.id ?? undefined;
    this.email = subscriber.email;
    this.name = subscriber.name;
    this.userId = subscriber.userId;
  }

  public toPOJO(): EmailSubscriber {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      userId: this.userId,
    };
  }

  public static fromObject(data: EmailSubscriber): EmailSubscriberEntity {
    return new EmailSubscriberEntity(data);
  }
}
