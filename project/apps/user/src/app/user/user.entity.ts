import { AuthUser } from '@project/types';
import { DefaultPojoType, Entity, EntityIdType } from '@project/helpers';
import { SALT_ROUNDS } from './user.constants';
import bcrypt from 'bcrypt';

export class UserEntity implements AuthUser, Entity<EntityIdType> {
  public id?: EntityIdType;
  public email!: string;
  public name!: string;
  public passwordHash!: string;

  constructor(user: AuthUser) {
    this.populate(user);
  }

  public toPOJO(): DefaultPojoType {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      passwordHash: this.passwordHash,
    } as DefaultPojoType;
  }

  public populate(user: AuthUser): void {
    this.email = user.email;
    this.name = user.name;
    this.passwordHash = user.passwordHash;
  }

  public async setPassword(password: string): Promise<UserEntity> {
    this.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    return this;
  }

  public async comparePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.passwordHash);
  }

  public static fromObject(data: AuthUser): UserEntity {
    return new UserEntity(data);
  }
}
