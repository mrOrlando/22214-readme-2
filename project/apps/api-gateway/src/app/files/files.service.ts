import { Injectable, Logger } from '@nestjs/common';
import { FileServerClient } from '../clients/file-server.client';

const FILES_PATH_PREFIX = '/api/files/';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  constructor(private readonly fileServerClient: FileServerClient) {}

  // Uploads an image and runs the action with its path. A file that was
  // uploaded for an action that failed is deleted: nobody can refer to it.
  public async runWithUpload<T>(
    file: Express.Multer.File | undefined,
    kind: 'avatar' | 'photo',
    action: (path?: string) => Promise<T>
  ): Promise<T> {
    if (!file) {
      return action();
    }

    const content = {
      buffer: file.buffer,
      originalName: file.originalname,
      mimeType: file.mimetype,
    };
    const uploaded =
      kind === 'avatar'
        ? await this.fileServerClient.uploadAvatar(content)
        : await this.fileServerClient.uploadPhoto(content);

    try {
      return await action(uploaded.path);
    } catch (error) {
      await this.discard(uploaded.id);
      throw error;
    }
  }

  private async discard(id: string): Promise<void> {
    try {
      await this.fileServerClient.delete(id);
    } catch {
      this.logger.warn(`The file ${FILES_PATH_PREFIX}${id} is not deleted`);
    }
  }
}
