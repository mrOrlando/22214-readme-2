const KILOBYTE = 1024;

// Limits of the specification. The file server checks them as well; here they
// stop an oversized upload before it fills the memory of the gateway
export const MAX_AVATAR_SIZE = 500 * KILOBYTE;
export const MAX_PHOTO_SIZE = 1024 * KILOBYTE;

export const FILE_ID_PATTERN =
  /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}\.(png|jpg)$/;

export const FILE_ID_ERROR = 'The file ID is not valid';
