import { Readable } from 'node:stream';

export interface FileResponse {
  id: string;
  path: string;
  kind: 'avatar' | 'photo';
  mimeType: string;
  size: number;
}

export interface DownloadedFile {
  stream: Readable;
  contentType: string;
  cacheControl?: string;
}
