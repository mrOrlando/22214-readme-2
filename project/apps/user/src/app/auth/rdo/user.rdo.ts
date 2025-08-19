import { User } from '@project/types';
import { Expose } from 'class-transformer';

export class UserRdo implements User {
  @Expose()
  public id!: string;

  @Expose()
  public name!: string;

  @Expose()
  public email!: string;
}
