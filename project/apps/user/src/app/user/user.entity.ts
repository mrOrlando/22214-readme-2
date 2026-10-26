import { AuthUser, UserRole } from '@project/types';
import { Entity, EntityIdType } from '@project/helpers';
import { SALT_ROUNDS } from './user.constants';
import bcrypt from 'bcrypt';

export class UserEntity implements AuthUser, Entity<EntityIdType, AuthUser> {
  public id?: EntityIdType;
  public email!: string;
  public name!: string;
  public role!: UserRole;
  public passwordHash!: string;
  public avatar?: string | null;
  public createdAt?: Date;

  constructor(user: AuthUser) {
    this.populate(user);
  }

  public toPOJO(): AuthUser {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role,
      passwordHash: this.passwordHash,
      avatar: this.avatar ?? null,
      createdAt: this.createdAt,
    };
  }

  public populate(user: AuthUser): void {
    this.id = user.id ?? undefined;
    this.email = user.email;
    this.name = user.name;
    this.role = user.role;
    this.passwordHash = user.passwordHash;
    this.avatar = user.avatar ?? null;
    this.createdAt = user.createdAt ?? undefined;
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
