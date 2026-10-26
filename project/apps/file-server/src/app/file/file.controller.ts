import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { fillDto } from '@project/helpers';
import { FileIdPipe } from './file-id.pipe';
import { FileKind, MAX_FILE_SIZE } from './file.constants';
import { FileService } from './file.service';
import { FileRdo } from './rdo/file.rdo';

const FILE_BODY = {
  schema: {
    type: 'object',
    required: ['file'],
    properties: { file: { type: 'string', format: 'binary' } },
  },
};

const ONE_YEAR_IN_SECONDS = 31536000;

@ApiTags('files')
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiOperation({ summary: 'Upload an avatar: jpg or png, up to 500 KB' })
  @ApiConsumes('multipart/form-data')
  @ApiBody(FILE_BODY)
  @ApiResponse({ status: HttpStatus.CREATED, type: FileRdo })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The file is missing or is not a jpg or png image.',
  })
  @ApiResponse({
    status: HttpStatus.PAYLOAD_TOO_LARGE,
    description: 'The file is larger than 500 KB.',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { files: 1, fileSize: MAX_FILE_SIZE[FileKind.Avatar] },
    })
  )
  @Post('/avatar')
  public async uploadAvatar(
    @UploadedFile() file?: Express.Multer.File
  ): Promise<FileRdo> {
    const storedFile = await this.fileService.save(file, FileKind.Avatar);
    return fillDto(FileRdo, storedFile);
  }

  @ApiOperation({ summary: 'Upload a photo of a post: jpg or png, up to 1 MB' })
  @ApiConsumes('multipart/form-data')
  @ApiBody(FILE_BODY)
  @ApiResponse({ status: HttpStatus.CREATED, type: FileRdo })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The file is missing or is not a jpg or png image.',
  })
  @ApiResponse({
    status: HttpStatus.PAYLOAD_TOO_LARGE,
    description: 'The file is larger than 1 MB.',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { files: 1, fileSize: MAX_FILE_SIZE[FileKind.Photo] },
    })
  )
  @Post('/photo')
  public async uploadPhoto(
    @UploadedFile() file?: Express.Multer.File
  ): Promise<FileRdo> {
    const storedFile = await this.fileService.save(file, FileKind.Photo);
    return fillDto(FileRdo, storedFile);
  }

  @ApiOperation({ summary: 'Download a file' })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiProduces('image/png', 'image/jpeg')
  @ApiResponse({ status: HttpStatus.OK, description: 'The file content.' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The file ID is not valid.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The file not found.',
  })
  @Get('/:id')
  public async download(
    @Param('id', FileIdPipe) id: string,
    @Res({ passthrough: true }) response: Response
  ): Promise<StreamableFile> {
    const { content, mimeType } = await this.fileService.read(id);

    // The ID is generated for every upload, so the content never changes
    response.set({
      'Content-Type': mimeType,
      'Cache-Control': `public, max-age=${ONE_YEAR_IN_SECONDS}, immutable`,
    });

    return new StreamableFile(content);
  }

  @ApiOperation({ summary: 'Delete a file' })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The file ID is not valid.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The file not found.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  public async destroy(@Param('id', FileIdPipe) id: string): Promise<void> {
    await this.fileService.delete(id);
  }
}
