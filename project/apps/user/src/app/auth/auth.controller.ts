import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto';
import { fillDto } from '@project/helpers';
import { UserRdo } from './rdo/user.rdo';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async create(@Body() dto: CreateUserDto): Promise<UserRdo> {
    const newUser = await this.authService.register(dto);
    return fillDto(UserRdo, newUser.toPOJO());
  }
}
