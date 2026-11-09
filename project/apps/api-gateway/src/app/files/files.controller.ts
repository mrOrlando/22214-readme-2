import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Res,
  StreamableFile,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { FileServerClient } from '../clients/file-server.client';
import { FileIdPipe } from './file-id.pipe';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly fileServerClient: FileServerClient) {}

  @ApiOperation({
    summary:
      'Download an image: an avatar or a photo of a post. The path of a file is in the data of the user or of the post',
  })
  @ApiParam({
    name: 'id',
    description: 'File ID',
    example: '5b8c93e4-92db-43c9-be4e-d6f94f08cda2.png',
  })
  @ApiProduces('image/png', 'image/jpeg')
  @ApiResponse({ status: HttpStatus.OK, description: 'The image.' })
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
    const { stream, contentType, cacheControl } =
      await this.fileServerClient.download(id);

    response.set({
      'Content-Type': contentType,
      ...(cacheControl && { 'Cache-Control': cacheControl }),
    });

    return new StreamableFile(stream);
  }
}
