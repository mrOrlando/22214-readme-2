import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { FILE_ID_ERROR, FILE_ID_PATTERN } from './files.constants';

// The ID is put to the address of the file server, so it must not contain
// anything but the name of a file
@Injectable()
export class FileIdPipe implements PipeTransform<string, string> {
  public transform(value: string): string {
    if (!FILE_ID_PATTERN.test(value)) {
      throw new BadRequestException(FILE_ID_ERROR);
    }

    return value;
  }
}
