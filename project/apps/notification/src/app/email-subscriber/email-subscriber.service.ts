import { Injectable, Logger } from '@nestjs/common';
import { EmailSubscriberEntity } from './email-subscriber.entity';
import { EmailSubscriberRepository } from './email-subscriber.repository';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';

@Injectable()
export class EmailSubscriberService {
  private readonly logger = new Logger(EmailSubscriberService.name);

  constructor(
    private readonly emailSubscriberRepository: EmailSubscriberRepository
  ) {}

  // Idempotent: a repeated event for the same email changes nothing
  public async addSubscriber(
    dto: CreateSubscriberDto
  ): Promise<EmailSubscriberEntity> {
    const existingSubscriber = await this.emailSubscriberRepository.findByEmail(
      dto.email
    );
    if (existingSubscriber) {
      this.logger.warn(`The subscriber ${dto.email} already exists`);
      return existingSubscriber;
    }

    return this.emailSubscriberRepository.save(new EmailSubscriberEntity(dto));
  }

  public async getAllSubscribers(): Promise<EmailSubscriberEntity[]> {
    return this.emailSubscriberRepository.findAll();
  }
}
