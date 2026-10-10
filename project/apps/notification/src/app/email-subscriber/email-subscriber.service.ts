import { Injectable } from '@nestjs/common';
import { EmailSubscriberEntity } from './email-subscriber.entity';
import { EmailSubscriberRepository } from './email-subscriber.repository';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';

@Injectable()
export class EmailSubscriberService {
  constructor(
    private readonly emailSubscriberRepository: EmailSubscriberRepository
  ) {}

  // Idempotent: a repeated event for the same email changes nothing
  public async addSubscriber(
    dto: CreateSubscriberDto
  ): Promise<EmailSubscriberEntity> {
    return this.emailSubscriberRepository.saveIfNew(
      new EmailSubscriberEntity(dto)
    );
  }

  public async getAllSubscribers(): Promise<EmailSubscriberEntity[]> {
    return this.emailSubscriberRepository.findAll();
  }
}
