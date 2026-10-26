import { Request } from 'express';
import { TokenPayload } from '@project/types';

export interface RequestWithUser extends Request {
  user: TokenPayload;
}
