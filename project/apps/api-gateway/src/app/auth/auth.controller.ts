import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { fillDto } from '@project/helpers';
import type { TokenPayload } from '@project/types';
import { UserClient } from '../clients/user.client';
import { AccessToken, CurrentUser } from './decorators';
import {
  ChangePasswordDto,
  LoginUserDto,
  RefreshTokenDto,
  RegisterUserDto,
} from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoggedUserRdo, TokenRdo, UserRdo } from './rdo';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly userClient: UserClient) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, type: UserRdo })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The data is not valid. The list of all errors is returned.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'The user with this e-mail already exists.',
  })
  @Post('register')
  public async register(@Body() dto: RegisterUserDto): Promise<UserRdo> {
    const user = await this.userClient.register(dto);
    return fillDto(UserRdo, user);
  }

  @ApiOperation({ summary: 'Log in and get a pair of tokens' })
  @ApiResponse({ status: HttpStatus.OK, type: LoggedUserRdo })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'The password is wrong.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The user with this e-mail not found.',
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  public async login(@Body() dto: LoginUserDto): Promise<LoggedUserRdo> {
    const loggedUser = await this.userClient.login(dto);

    // The login answer has no name and avatar: they are added here
    const [profile] = await this.userClient.getUsersByIds([loggedUser.id]);

    return fillDto(LoggedUserRdo, { ...profile, ...loggedUser });
  }

  @ApiOperation({
    summary:
      'Get a new pair of tokens by a refresh token. A refresh token can be used only once',
  })
  @ApiResponse({ status: HttpStatus.OK, type: TokenRdo })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'The refresh token is invalid, expired or already used.',
  })
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  public async refresh(
    @Body() { refreshToken }: RefreshTokenDto
  ): Promise<TokenRdo> {
    const tokens = await this.userClient.refreshTokens(refreshToken);
    return fillDto(TokenRdo, tokens);
  }

  @ApiOperation({ summary: 'Get the current user' })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: UserRdo })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'The access token is missing, invalid or expired.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  public async me(
    @CurrentUser() { sub }: TokenPayload,
    @AccessToken() accessToken: string
  ): Promise<UserRdo> {
    const user = await this.userClient.getUser(accessToken, sub);
    return fillDto(UserRdo, user);
  }

  @ApiOperation({
    summary:
      'Change the password of the current user. All refresh tokens of the user are revoked',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: UserRdo })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The new password is not valid.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'The access token is invalid or the current password is wrong.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('password')
  public async changePassword(
    @AccessToken() accessToken: string,
    @Body() dto: ChangePasswordDto
  ): Promise<UserRdo> {
    const user = await this.userClient.changePassword(accessToken, dto);
    return fillDto(UserRdo, user);
  }
}
