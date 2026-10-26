import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';
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
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { UserProfileRdo } from './rdo/user-profile.rdo';
import { ProfileService } from './profile.service';

const USER_ID = { name: 'id', description: 'User ID (MongoDB ObjectId)' };
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
}
