import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { fillDto } from '@project/helpers';
import { UserRdo } from './rdo';
import { LoggedUserRdo } from './rdo';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async create(@Body() dto: CreateUserDto): Promise<UserRdo> {
    const newUser = await this.authService.register(dto);
    return fillDto(UserRdo, newUser.toPOJO());
  }

  @Post('login')
  public async login(@Body() dto: LoginUserDto) {
    const verifiedUser = await this.authService.verifyUser(dto);
    return fillDto(LoggedUserRdo, verifiedUser);
  }

  @Get(':id')
  public async show(@Param('id') id: string): Promise<UserRdo> {
    const existingUser = await this.authService.getUser(id);
    return fillDto(UserRdo, existingUser.toPOJO());
  }
}
