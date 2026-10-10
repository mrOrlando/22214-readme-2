import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { MAX_POST_TAGS_COUNT } from '../blog-post.constants';
import {
  normalizeTagTitle,
  TAG_TITLE_PATTERN,
  TAG_TITLE_PATTERN_ERROR,
  TagTitleLength,
} from '../../blog-tag/blog-tag.constants';

function normalizeTags(value: unknown): unknown {
  if (!Array.isArray(value)) {
    return value;
  }

  // Tags are stored in lower case, duplicates are removed silently
  return [
    ...new Set(
      value.map((tag) =>
        typeof tag === 'string' ? normalizeTagTitle(tag) : tag
      )
    ),
  ];
}

export function PostTags() {
  return applyDecorators(
    ApiProperty({
      description:
        'Post tags (titles). Case-insensitive, duplicates are removed',
      example: ['horror', 'books'],
      required: false,
      maxItems: MAX_POST_TAGS_COUNT,
      type: [String],
    }),
    IsOptional(),
    Transform(({ value }) => normalizeTags(value)),
    IsArray(),
    ArrayMaxSize(MAX_POST_TAGS_COUNT),
    IsString({ each: true }),
    Length(TagTitleLength.Min, TagTitleLength.Max, { each: true }),
    Matches(TAG_TITLE_PATTERN, {
      each: true,
      message: `each value in tags is invalid: ${TAG_TITLE_PATTERN_ERROR}`,
    })
  );
}
