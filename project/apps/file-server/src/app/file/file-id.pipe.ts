import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { FILE_ID_ERROR, FILE_ID_PATTERN } from './file.constants';

@Injectable()
export class FileIdPipe implements PipeTransform<string, string> {
  public transform(value: string): string {
    if (!FILE_ID_PATTERN.test(value)) {
      throw new BadRequestException(FILE_ID_ERROR);
    }

    return value;
  }
}
