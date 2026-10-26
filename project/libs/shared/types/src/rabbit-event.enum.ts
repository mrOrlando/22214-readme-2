export const RabbitEvent = {
  UserRegistered: 'user.registered',
  PostPublished: 'post.published',
} as const;

export type RabbitEvent = (typeof RabbitEvent)[keyof typeof RabbitEvent];
