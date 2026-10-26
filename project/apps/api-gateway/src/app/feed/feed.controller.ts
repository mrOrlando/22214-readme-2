import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { fillDto } from '@project/helpers';
import type { TokenPayload } from '@project/types';
import { AccessToken, CurrentUser } from '../auth/decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PostsWithPaginationRdo } from '../posts/rdo';
import { FeedQuery } from './feed.query';
import { FeedService } from './feed.service';

@ApiTags('feed')
@ApiBearerAuth()
@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @ApiOperation({
    summary:
      'Get the feed of the current user: published posts of the authors he is subscribed to and own posts. Pagination, sorting and filters are the same as of the list of posts',
  })
  @ApiResponse({ status: HttpStatus.OK, type: PostsWithPaginationRdo })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Query parameters are not valid.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'The access token is missing, invalid or expired.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/')
  public async index(
    @CurrentUser() { sub }: TokenPayload,
    @AccessToken() accessToken: string,
    @Query() query: FeedQuery
  ): Promise<PostsWithPaginationRdo> {
    const feed = await this.feedService.getFeed(sub, accessToken, query);
    return fillDto(PostsWithPaginationRdo, feed);
  }
}
