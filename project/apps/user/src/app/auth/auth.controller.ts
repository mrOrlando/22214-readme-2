import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
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
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { LoggedUserRdo, TokenRdo, UserRdo } from './rdo';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import type { RequestWithTokenPayload } from './request-with-token-payload.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been successfully created.',
    type: UserRdo,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'The user with this email already exists.',
  })
  @Post('register')
  public async create(@Body() dto: CreateUserDto): Promise<UserRdo> {
    const newUser = await this.authService.register(dto);
    return fillDto(UserRdo, newUser.toPOJO());
  }

  @ApiOperation({ summary: 'Log in and get a pair of tokens' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully logged in.',
    type: LoggedUserRdo,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'The password is wrong.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The user with this email not found.',
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  public async login(@Body() dto: LoginUserDto): Promise<LoggedUserRdo> {
    const verifiedUser = await this.authService.verifyUser(dto);
    const token = await this.authService.createUserToken(verifiedUser);

    return fillDto(LoggedUserRdo, { ...verifiedUser.toPOJO(), ...token });
  }

  @ApiOperation({ summary: 'Get a new pair of tokens by a refresh token' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A new pair of tokens.',
    type: TokenRdo,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'The refresh token is invalid, expired or already used.',
  })
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  public async refreshToken(
    @Req() { user }: RequestWithTokenPayload
  ): Promise<TokenRdo> {
    const token = await this.authService.createToken(user);
    return fillDto(TokenRdo, token);
  }

  @ApiOperation({ summary: 'Get user details' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'User ID (MongoDB ObjectId)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully found.',
    type: UserRdo,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The user ID is not valid.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'The user is not authorized.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The user with this ID not found.',
  })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public async show(
    @Param('id', MongoIdValidationPipe) id: string
  ): Promise<UserRdo> {
    const existingUser = await this.authService.getUser(id);
    return fillDto(UserRdo, existingUser.toPOJO());
  }
}
