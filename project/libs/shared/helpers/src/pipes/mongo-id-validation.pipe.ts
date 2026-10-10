import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { Types } from 'mongoose';

const BAD_MONGO_ID_ERROR = 'Bad entity ID';

@Injectable()
export class MongoIdValidationPipe implements PipeTransform {
  public transform(value: string, { type }: ArgumentMetadata) {
    if (type !== 'param' && type !== 'query') {
      throw new Error('This pipe must be used only with params or query!');
    }

    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(BAD_MONGO_ID_ERROR);
    }

    return value;
  }
}
