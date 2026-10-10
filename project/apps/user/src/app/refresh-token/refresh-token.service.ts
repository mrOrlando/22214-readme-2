import { Injectable } from '@nestjs/common';
import { RefreshTokenPayload } from '@project/types';
import { RefreshTokenEntity } from './refresh-token.entity';
import { RefreshTokenRepository } from './refresh-token.repository';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository
  ) {}

  public async createRefreshSession(
    payload: RefreshTokenPayload,
    expiresIn: Date
  ): Promise<RefreshTokenEntity> {
    const refreshToken = new RefreshTokenEntity({
      tokenId: payload.tokenId,
      userId: payload.sub,
      expiresIn,
    });

    return this.refreshTokenRepository.save(refreshToken);
  }

  public async deleteRefreshSession(tokenId: string): Promise<void> {
    await this.refreshTokenRepository.deleteByTokenId(tokenId);
  }

  public async deleteUserRefreshSessions(userId: string): Promise<void> {
    await this.refreshTokenRepository.deleteByUserId(userId);
  }

  public async isExists(tokenId: string): Promise<boolean> {
    const refreshToken = await this.refreshTokenRepository.findByTokenId(
      tokenId
    );

    return refreshToken !== null;
  }
}
