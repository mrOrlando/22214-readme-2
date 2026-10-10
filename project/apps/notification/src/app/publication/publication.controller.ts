import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RabbitEvent } from '@project/types';
import { acknowledge } from '../common/acknowledge';
import { AddPublicationDto } from './dto/add-publication.dto';
import { PublicationService } from './publication.service';

@Controller()
export class PublicationController {
  private readonly logger = new Logger(PublicationController.name);

  constructor(private readonly publicationService: PublicationService) {}

  @EventPattern(RabbitEvent.PostPublished)
  public async create(
    @Payload() dto: AddPublicationDto,
    @Ctx() context: RmqContext
  ): Promise<void> {
    await acknowledge(context, this.logger, () =>
      this.publicationService.addPublication(dto)
    );
  }
}
