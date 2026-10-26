import { applyDecorators } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

// The gateway checks only the shape of the data. Limits and rules of every
// type of post are checked by the blog service, which returns all errors at once.
export function OptionalText(description: string, example: string) {
  return applyDecorators(
    ApiPropertyOptional({ description, example }),
    IsOptional(),
    IsString()
  );
}

export function OptionalTags() {
  return applyDecorators(
    ApiPropertyOptional({
      description:
        'Tags: single words of 3 to 10 letters, at most 8. They are lower-cased and duplicates are removed',
      example: ['books', 'scifi'],
      type: [String],
    }),
    IsOptional(),
    IsArray(),
    IsString({ each: true })
  );
}
