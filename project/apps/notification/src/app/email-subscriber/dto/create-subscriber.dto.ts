import { IsEmail, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { UserRegisteredPayload } from '@project/types';

export class CreateSubscriberDto implements UserRegisteredPayload {
  @IsMongoId()
  public userId!: string;

  @IsEmail()
  public email!: string;

  @IsString()
  @IsNotEmpty()
  public name!: string;
}
