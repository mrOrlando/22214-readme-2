import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayload } from '@project/types';
import { RequestWithUser } from '../request-with-user.interface';

// The user is taken from the access token and never from the data of a client
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): TokenPayload =>
    context.switchToHttp().getRequest<RequestWithUser>().user
);
