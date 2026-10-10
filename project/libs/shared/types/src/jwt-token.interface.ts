export interface JwtToken {
  id?: string;
  tokenId: string;
  userId: string;
  createdAt?: Date;
  expiresIn: Date;
}
