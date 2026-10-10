export const AUTH_USER_EXISTS_ERROR = 'User already exists';

export const AUTH_USER_NOT_FOUND = 'User not found';

export const AUTH_USER_PASSWORD_WRONG = 'User password is wrong';

export const AUTH_REFRESH_TOKEN_NOT_FOUND =
  'Refresh token is not found or has already been used';

export const UserNameLength = {
  Min: 3,
  Max: 50,
} as const;

export const UserPasswordLength = {
  Min: 6,
  Max: 12,
} as const;
