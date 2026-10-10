import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { RabbitEvent } from '@project/types';
import { RABBITMQ_SERVICE } from './rabbit.constants';

const PUBLISH_TIMEOUT_MS = 5000;

// Publishes events to RabbitMQ. A failed publication must never break
// the operation that caused the event, so errors are only logged.
@Injectable()
export class RabbitPublisher {
  private readonly logger = new Logger(RabbitPublisher.name);

  constructor(@Inject(RABBITMQ_SERVICE) private readonly client: ClientProxy) {}

  public async publish<Payload>(
    event: RabbitEvent,
    payload: Payload
  ): Promise<void> {
    try {
      await firstValueFrom(
        this.client.emit(event, payload).pipe(timeout(PUBLISH_TIMEOUT_MS)),
        { defaultValue: undefined }
      );
    } catch (error) {
      this.logger.error(
        `Failed to publish the "${event}" event: ${
          error instanceof Error ? error.message : error
        }`
      );
    }
  }
}
