import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { FileKind } from '../file.constants';

export class FileRdo {
  @ApiProperty({
    description: 'File ID: a generated name with the extension',
    example: '5b8c93e4-92db-43c9-be4e-d6f94f08cda2.png',
  })
  @Expose()
  public id!: string;

  @ApiProperty({
    description: 'Path to download the file',
    example: '/api/files/5b8c93e4-92db-43c9-be4e-d6f94f08cda2.png',
  })
  @Expose()
  public path!: string;

  @ApiProperty({ enum: Object.values(FileKind), example: FileKind.Photo })
  @Expose()
  public kind!: FileKind;

  @ApiProperty({ description: 'Detected mime type', example: 'image/png' })
  @Expose()
  public mimeType!: string;

  @ApiProperty({ description: 'Size in bytes', example: 31243 })
  @Expose()
  public size!: number;
}
