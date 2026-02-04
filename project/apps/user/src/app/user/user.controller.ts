import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel } from './user.schema';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto';

@Controller({ path: 'users' })
export class UserController {
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserModel>
  ) {}

  @Post('/register')
  public create(@Body() createUserDto: CreateUserDto): Promise<UserModel> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  @Get('/')
  public async index(): Promise<UserModel[]> {
    return this.userModel.find().exec();
  }
}
