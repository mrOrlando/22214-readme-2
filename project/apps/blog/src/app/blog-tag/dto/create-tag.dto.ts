import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, Length, Matches } from 'class-validator';
import {
  normalizeTagTitle,
  TAG_TITLE_PATTERN,
  TAG_TITLE_PATTERN_ERROR,
  TagTitleLength,
} from '../blog-tag.constants';

export class CreateTagDto {
  @ApiProperty({
    description:
      'Unique tag title: a single word that starts with a letter. Stored in lower case',
    example: 'flowers',
    minLength: TagTitleLength.Min,
    maxLength: TagTitleLength.Max,
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? normalizeTagTitle(value) : value
  )
  @IsString()
  @Length(TagTitleLength.Min, TagTitleLength.Max)
  @Matches(TAG_TITLE_PATTERN, { message: TAG_TITLE_PATTERN_ERROR })
  public title!: string;
}
