import { TokenPayload } from '@project/types';

export interface RequestWithTokenPayload {
  user: TokenPayload;
}
