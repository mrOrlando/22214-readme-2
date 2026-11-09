import { Injectable } from '@nestjs/common';
import { UserClient } from '../clients/user.client';
import { FilesService } from '../files/files.service';
import { RegisterUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userClient: UserClient,
    private readonly filesService: FilesService
  ) {}

  // The avatar is uploaded first and its path is saved with the user
  public async register(dto: RegisterUserDto, avatar?: Express.Multer.File) {
    return this.filesService.runWithUpload(avatar, 'avatar', (avatarPath) =>
      this.userClient.register({ ...dto, avatar: avatarPath })
    );
  }
}
