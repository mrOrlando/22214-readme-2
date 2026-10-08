import { Entity, EntityIdType } from '@project/helpers';
import { JwtToken } from '@project/types';

export class RefreshTokenEntity
  implements JwtToken, Entity<EntityIdType, JwtToken>
{
  public id?: EntityIdType;
  public tokenId!: string;
  public userId!: string;
  public createdAt?: Date;
  public expiresIn!: Date;

  constructor(token: JwtToken) {
    this.populate(token);
  }

  public populate(token: JwtToken): void {
    this.id = token.id ?? undefined;
    this.tokenId = token.tokenId;
    this.userId = token.userId;
    this.createdAt = token.createdAt ?? undefined;
    this.expiresIn = token.expiresIn;
  }

  public toPOJO(): JwtToken {
    return {
      id: this.id,
      tokenId: this.tokenId,
      userId: this.userId,
      createdAt: this.createdAt,
      expiresIn: this.expiresIn,
    };
  }

  public static fromObject(data: JwtToken): RefreshTokenEntity {
    return new RefreshTokenEntity(data);
  }
}
