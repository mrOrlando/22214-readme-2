export const MAX_TAGS_LIMIT = 10;

export const TagTitleLength = {
  Min: 3,
  Max: 10,
} as const;

// A tag is a single word that starts with a letter
export const TAG_TITLE_PATTERN = /^\p{L}\S*$/u;

export const TAG_TITLE_PATTERN_ERROR =
  'a tag must be a single word that starts with a letter';

export function normalizeTagTitle(title: string): string {
  return title.trim().toLowerCase();
}

export const TAG_EXISTS_ERROR = 'Tag with this title already exists';
