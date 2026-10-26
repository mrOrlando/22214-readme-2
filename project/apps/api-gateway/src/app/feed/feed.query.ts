import { OmitType } from '@nestjs/swagger';
import { PostsQuery } from '../posts/dto';

// The authors of the feed are defined by the subscriptions, not by the client
export class FeedQuery extends OmitType(PostsQuery, ['userId'] as const) {}
