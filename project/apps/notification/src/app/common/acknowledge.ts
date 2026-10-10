import { Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';

// The queue is consumed without auto-ack: a message is confirmed after
// the handler succeeds. A message that cannot be handled (for example, it
// does not pass validation) is rejected without returning to the queue.
export async function acknowledge(
  context: RmqContext,
  logger: Logger,
  handler: () => Promise<unknown>
): Promise<void> {
  const channel = context.getChannelRef();
  const message = context.getMessage();

  try {
    await handler();
    channel.ack(message);
  } catch (error) {
    logger.error(
      `Failed to handle the message: ${
        error instanceof Error ? error.message : error
      }`
    );
    channel.nack(message, false, false);
  }
}
