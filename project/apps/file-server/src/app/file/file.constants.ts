export const FileKind = {
  Avatar: 'avatar',
  Photo: 'photo',
} as const;

export type FileKind = (typeof FileKind)[keyof typeof FileKind];

const KILOBYTE = 1024;

// Limits of the specification: an avatar is up to 500 KB, a photo is up to 1 MB
export const MAX_FILE_SIZE: Record<FileKind, number> = {
  [FileKind.Avatar]: 500 * KILOBYTE,
  [FileKind.Photo]: 1024 * KILOBYTE,
};

export const ImageType = {
  Png: { extension: 'png', mimeType: 'image/png' },
  Jpeg: { extension: 'jpg', mimeType: 'image/jpeg' },
} as const;

export const FILE_ID_PATTERN =
  /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}\.(png|jpg)$/;

export const FILES_ROUTE = '/api/files';

export const FILE_NOT_PROVIDED_ERROR =
  'The file is required: send it in the "file" field of a multipart request';
export const FILE_TYPE_ERROR = 'Only jpg and png images are allowed';
export const FILE_NOT_FOUND_ERROR = 'File not found';
export const FILE_ID_ERROR = 'The file ID is not valid';
