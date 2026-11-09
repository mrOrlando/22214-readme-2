import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from '../request-with-user.interface';

const BEARER_PREFIX = 'Bearer ';

// The raw access token, to pass it to the services that check it themselves
export const AccessToken = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    const header = context.switchToHttp().getRequest<RequestWithUser>()
      .headers.authorization;

    return header?.startsWith(BEARER_PREFIX)
      ? header.slice(BEARER_PREFIX.length)
      : '';
  }
);
