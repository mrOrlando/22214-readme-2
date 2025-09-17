import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { fillDto } from '@project/helpers';
import { UserRdo } from './rdo';
import { LoggedUserRdo } from './rdo';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been successfully created.',
    type: UserRdo,
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

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully logged in.',
    type: LoggedUserRdo,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'The user has not been logged in.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The user with this email not found.',
  })
  @Post('login')
  public async login(@Body() dto: LoginUserDto): Promise<LoggedUserRdo> {
    const verifiedUser = await this.authService.verifyUser(dto);
    return fillDto(LoggedUserRdo, verifiedUser);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully found.',
    type: UserRdo,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The user with this ID not found.',
  })
  @Get(':id')
  public async show(@Param('id') id: string): Promise<UserRdo> {
    const existingUser = await this.authService.getUser(id);
    return fillDto(UserRdo, existingUser.toPOJO());
  }
}
