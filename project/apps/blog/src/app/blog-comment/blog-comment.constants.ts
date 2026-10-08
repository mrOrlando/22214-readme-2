export const CommentMessageLength = { Min: 10, Max: 300 } as const;

export const DEFAULT_COMMENT_COUNT_LIMIT = 50;
export const DEFAULT_COMMENT_PAGE_COUNT = 1;

export const COMMENT_NOT_FOUND_ERROR = 'Comment not found';
export const COMMENT_FORBIDDEN_ERROR = 'Only the author can delete the comment';
