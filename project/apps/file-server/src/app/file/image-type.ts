import { ImageType } from './file.constants';

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const JPEG_SIGNATURE = [0xff, 0xd8, 0xff];

function startsWith(buffer: Buffer, signature: number[]): boolean {
  return signature.every((byte, index) => buffer[index] === byte);
}

// The type is detected by the content: the name and the mime type sent
// by a client can be anything
export function detectImageType(
  buffer: Buffer
): (typeof ImageType)[keyof typeof ImageType] | null {
  if (startsWith(buffer, PNG_SIGNATURE)) {
    return ImageType.Png;
  }

  if (startsWith(buffer, JPEG_SIGNATURE)) {
    return ImageType.Jpeg;
  }

  return null;
}
