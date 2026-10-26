import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { fillDto, MongoIdValidationPipe } from '@project/helpers';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { RequestWithTokenPayload } from '../auth/request-with-token-payload.interface';
import { UsersByIdsQuery } from './dto/users-by-ids.query';
import { PublicUserRdo, SubscriptionsRdo, UserDetailsRdo } from './rdo';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary:
      'Get public data (name and avatar) of several users, for example authors of posts',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found users. Unknown IDs are skipped.',
    type: [PublicUserRdo],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The list of IDs is empty, too long or contains invalid IDs.',
  })
  @Get('/')
  public async index(
    @Query() { ids }: UsersByIdsQuery
  ): Promise<PublicUserRdo[]> {
    const users = await this.userService.getUsersByIds(ids);
    return users.map((user) => fillDto(PublicUserRdo, user.toPOJO()));
  }

  @ApiOperation({
    summary: 'Get the IDs of the authors the current user is subscribed to',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: SubscriptionsRdo })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'The user is not authorized.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/me/subscriptions')
  public async subscriptions(
    @Req() { user }: RequestWithTokenPayload
  ): Promise<SubscriptionsRdo> {
    const authorIds = await this.userService.getSubscriptions(user.sub);
    return fillDto(SubscriptionsRdo, { authorIds });
  }

  @ApiOperation({
    summary:
      'Get details of a user: registration date and number of subscribers',
  })
  @ApiParam({ name: 'id', description: 'User ID (MongoDB ObjectId)' })
  @ApiResponse({ status: HttpStatus.OK, type: UserDetailsRdo })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The user ID is not valid.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The user with this ID not found.',
  })
  @Get('/:id')
  public async show(
    @Param('id', MongoIdValidationPipe) id: string
  ): Promise<UserDetailsRdo> {
    const { user, subscribersCount } = await this.userService.getUserDetails(
      id
    );

    return fillDto(UserDetailsRdo, {
      ...user.toPOJO(),
      registeredAt: user.createdAt,
      subscribersCount,
    });
  }

  @ApiOperation({ summary: 'Subscribe the current user to an author' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Author ID (MongoDB ObjectId)' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The subscription has been created.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The ID is not valid or it is the ID of the current user.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'The user is not authorized.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The author not found.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'The user is already subscribed to the author.',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/:id/subscription')
  public async subscribe(
    @Req() { user }: RequestWithTokenPayload,
    @Param('id', MongoIdValidationPipe) authorId: string
  ): Promise<void> {
    await this.userService.subscribe(user.sub, authorId);
  }

  @ApiOperation({ summary: 'Unsubscribe the current user from an author' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Author ID (MongoDB ObjectId)' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The subscription has been removed.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The author ID is not valid.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'The user is not authorized.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The user is not subscribed to the author.',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id/subscription')
  public async unsubscribe(
    @Req() { user }: RequestWithTokenPayload,
    @Param('id', MongoIdValidationPipe) authorId: string
  ): Promise<void> {
    await this.userService.unsubscribe(user.sub, authorId);
  }
}
