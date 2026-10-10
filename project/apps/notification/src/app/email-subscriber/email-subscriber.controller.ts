import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RabbitEvent } from '@project/types';
import { acknowledge } from '../common/acknowledge';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { EmailSubscriberService } from './email-subscriber.service';

@Controller()
export class EmailSubscriberController {
  private readonly logger = new Logger(EmailSubscriberController.name);

  constructor(
    private readonly emailSubscriberService: EmailSubscriberService
  ) {}

  @EventPattern(RabbitEvent.UserRegistered)
  public async create(
    @Payload() dto: CreateSubscriberDto,
    @Ctx() context: RmqContext
  ): Promise<void> {
    await acknowledge(context, this.logger, () =>
      this.emailSubscriberService.addSubscriber(dto)
    );
  }
}
