export interface UserResponse {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}

export interface LoggedUserResponse {
  id: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

export interface TokenPairResponse {
  accessToken: string;
  refreshToken: string;
}

export interface PublicUserResponse {
  id: string;
  name: string;
  avatar: string | null;
}

export interface UserDetailsResponse extends PublicUserResponse {
  registeredAt: string;
  subscribersCount: number;
}

export interface SubscriptionsResponse {
  authorIds: string[];
}
