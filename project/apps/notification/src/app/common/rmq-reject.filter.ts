import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { EMPTY, Observable } from 'rxjs';

// An exception thrown before the handler runs (for example, by the validation
// pipe) leaves the message neither confirmed nor rejected. Such a message can
// never be handled, so it is rejected without returning to the queue.
@Catch()
export class RmqRejectFilter implements ExceptionFilter {
  private readonly logger = new Logger(RmqRejectFilter.name);

  public catch(exception: unknown, host: ArgumentsHost): Observable<never> {
    const context = host.switchToRpc().getContext<RmqContext>();
    const reason =
      exception instanceof HttpException
        ? JSON.stringify(exception.getResponse())
        : exception instanceof Error
        ? exception.message
        : exception;

    this.logger.error(
      `The message "${context.getPattern()}" is rejected: ${reason}`
    );
    context.getChannelRef().nack(context.getMessage(), false, false);

    return EMPTY;
  }
}
