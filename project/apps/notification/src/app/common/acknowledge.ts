import { setTimeout } from 'node:timers/promises';
import { Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';

// Pauses between attempts to handle a message
const RETRY_DELAYS_MS = [1000, 5000, 15000];

// The queue is consumed without auto-ack: a message is confirmed after
// the handler succeeds. A failed handler is repeated with pauses, so that
// a short outage (for example, of the database) does not lose the message.
// When all attempts fail, the message returns to the queue once and is
// rejected for good the next time.
export async function acknowledge(
  context: RmqContext,
  logger: Logger,
  handler: () => Promise<unknown>
): Promise<void> {
  const channel = context.getChannelRef();
  const message = context.getMessage();

  for (let attempt = 0; ; attempt++) {
    try {
      await handler();
      channel.ack(message);
      return;
    } catch (error) {
      logger.error(
        `Failed to handle the message (attempt ${attempt + 1}): ${
          error instanceof Error ? error.message : error
        }`
      );

      const delay = RETRY_DELAYS_MS[attempt];
      if (delay === undefined) {
        break;
      }
      await setTimeout(delay);
    }
  }

  channel.nack(message, false, !message.fields.redelivered);
}
