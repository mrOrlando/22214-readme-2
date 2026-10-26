import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
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
import type { TokenPayload } from '@project/types';
import { AccessToken, CurrentUser } from '../auth/decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { AuthorRdo } from '../users/author.rdo';
import { UserProfileRdo } from './rdo/user-profile.rdo';
import { ProfileService } from './profile.service';

const USER_ID = { name: 'id', description: 'User ID (MongoDB ObjectId)' };
const UNAUTHORIZED = {
  status: HttpStatus.UNAUTHORIZED,
  description: 'The access token is missing, invalid or expired.',
};
const BAD_ID = {
  status: HttpStatus.BAD_REQUEST,
  description: 'The user ID is not valid.',
};
const USER_NOT_FOUND = {
  status: HttpStatus.NOT_FOUND,
  description: 'The user not found.',
};

@ApiTags('users')
@Controller('users')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({
    summary: 'Get the authors the current user is subscribed to, newest first',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: [AuthorRdo] })
  @ApiResponse(UNAUTHORIZED)
  @UseGuards(JwtAuthGuard)
  @Get('/me/subscriptions')
  public async subscriptions(
    @AccessToken() accessToken: string
  ): Promise<AuthorRdo[]> {
    const authors = await this.profileService.getSubscriptions(accessToken);
    return authors.map((author) => fillDto(AuthorRdo, author));
  }

  @ApiOperation({
    summary:
      'Get the profile of a user: registration date, numbers of subscribers and published posts. Posts of the user: GET /posts?userId=',
  })
  @ApiBearerAuth()
  @ApiParam(USER_ID)
  @ApiResponse({ status: HttpStatus.OK, type: UserProfileRdo })
  @ApiResponse(BAD_ID)
  @ApiResponse(USER_NOT_FOUND)
  @UseGuards(OptionalJwtAuthGuard)
  @Get('/:id')
  public async show(
    @Param('id', MongoIdValidationPipe) id: string,
    @CurrentUser() user: TokenPayload | undefined,
    @AccessToken() accessToken: string
  ): Promise<UserProfileRdo> {
    // An invalid token makes the request anonymous (see OptionalJwtAuthGuard)
    const profile = await this.profileService.getProfile(
      id,
      user ? accessToken : undefined
    );
    return fillDto(UserProfileRdo, profile);
  }

  @ApiOperation({ summary: 'Subscribe the current user to an author' })
  @ApiBearerAuth()
  @ApiParam(USER_ID)
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The ID is not valid or it is the ID of the current user.',
  })
  @ApiResponse(UNAUTHORIZED)
  @ApiResponse(USER_NOT_FOUND)
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'The user is already subscribed to the author.',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/:id/subscription')
  public async subscribe(
    @Param('id', MongoIdValidationPipe) authorId: string,
    @AccessToken() accessToken: string
  ): Promise<void> {
    await this.profileService.subscribe(accessToken, authorId);
  }

  @ApiOperation({ summary: 'Unsubscribe the current user from an author' })
  @ApiBearerAuth()
  @ApiParam(USER_ID)
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse(BAD_ID)
  @ApiResponse(UNAUTHORIZED)
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The user is not subscribed to the author.',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id/subscription')
  public async unsubscribe(
    @Param('id', MongoIdValidationPipe) authorId: string,
    @AccessToken() accessToken: string
  ): Promise<void> {
    await this.profileService.unsubscribe(accessToken, authorId);
  }
}
