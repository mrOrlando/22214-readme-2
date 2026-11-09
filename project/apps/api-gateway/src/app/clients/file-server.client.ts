import { Readable } from 'node:stream';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import FormData from 'form-data';
import { ServiceClient } from './service-client';
import { DownloadedFile, FileResponse } from './types';

export interface UploadedContent {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
}

@Injectable()
export class FileServerClient extends ServiceClient {
  constructor(http: HttpService, config: ConfigService) {
    super(
      http,
      config.getOrThrow<string>('gateway.fileServerUrl'),
      'file server'
    );
  }

  public uploadAvatar(file: UploadedContent): Promise<FileResponse> {
    return this.upload('/files/avatar', file);
  }

  public uploadPhoto(file: UploadedContent): Promise<FileResponse> {
    return this.upload('/files/photo', file);
  }

  public async download(id: string): Promise<DownloadedFile> {
    const response = await this.send<Readable>('GET', `/files/${id}`, {
      responseType: 'stream',
    });

    return {
      stream: response.data,
      contentType: `${response.headers['content-type']}`,
      cacheControl: response.headers['cache-control'] as string | undefined,
    };
  }

  public async delete(id: string): Promise<void> {
    await this.request('DELETE', `/files/${id}`);
  }

  private upload(path: string, file: UploadedContent): Promise<FileResponse> {
    const body = new FormData();
    body.append('file', file.buffer, {
      filename: file.originalName,
      contentType: file.mimeType,
    });

    return this.request('POST', path, {
      body,
      headers: body.getHeaders(),
    });
  }
}
