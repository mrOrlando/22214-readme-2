import { setTimeout } from 'node:timers/promises';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { RabbitEvent } from '@project/types';
import { RABBITMQ_SERVICE } from './rabbit.constants';

const PUBLISH_TIMEOUT_MS = 5000;
// Pauses between attempts to publish an event
const RETRY_DELAYS_MS = [1000, 5000, 30000, 60000];

// Publishes events to RabbitMQ in the background. A failed publication must
// never break or slow down the operation that caused the event, so it is
// repeated with pauses and errors are only logged. Consumers must be
// idempotent: a repeated attempt can deliver the same event twice.
@Injectable()
export class RabbitPublisher {
  private readonly logger = new Logger(RabbitPublisher.name);

  constructor(@Inject(RABBITMQ_SERVICE) private readonly client: ClientProxy) {}

  public publish<Payload>(event: RabbitEvent, payload: Payload): void {
    void this.deliver(event, payload);
  }

  private async deliver<Payload>(
    event: RabbitEvent,
    payload: Payload
  ): Promise<void> {
    for (let attempt = 0; ; attempt++) {
      try {
        await firstValueFrom(
          this.client.emit(event, payload).pipe(timeout(PUBLISH_TIMEOUT_MS)),
          { defaultValue: undefined }
        );
        return;
      } catch (error) {
        const delay = RETRY_DELAYS_MS[attempt];
        this.logger.error(
          `Failed to publish the "${event}" event (attempt ${attempt + 1}${
            delay === undefined ? ', gave up' : ''
          }): ${error instanceof Error ? error.message : error}`
        );

        if (delay === undefined) {
          return;
        }
        await setTimeout(delay);
      }
    }
  }
}
